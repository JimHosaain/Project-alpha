const express = require('express')

function toNumber(value, fallback = 0) {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

function lower(value) {
  return String(value || '').trim().toLowerCase()
}

function parseJson(value, fallback = {}) {
  if (value == null) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function estimateBenchmarkScore(row, specs) {
  const price = toNumber(row.price)
  const category = lower(row.category)

  if (category === 'cpu') return Math.max(45, Math.min(96, Math.round(price / 260)))
  if (category === 'gpu') return Math.max(40, Math.min(99, Math.round(price / 730)))
  if (category === 'motherboard') return Math.max(35, Math.min(90, Math.round(price / 380)))
  if (category === 'ram') return Math.max(30, Math.min(85, Math.round((price + toNumber(specs.capacity_gb, 0) * 2) / 220)))
  if (category === 'storage') return Math.max(28, Math.min(88, Math.round((price + toNumber(specs.capacity_gb, 0) / 2) / 180)))
  if (category === 'psu') return Math.max(35, Math.min(90, Math.round(price / 240)))
  if (category === 'case') return Math.max(30, Math.min(82, Math.round(price / 220)))

  return Math.max(30, Math.min(90, Math.round(price / 300)))
}

function normalizePart(row) {
  const specs = parseJson(row.specs_json, {})
  return {
    part_id: row.part_id,
    id: row.part_id,
    category: row.category,
    part_name: row.part_name,
    brand: row.brand,
    model: row.model,
    price: toNumber(row.price),
    watt: toNumber(row.watt),
    stock_status: row.stock_status,
    specs,
    socket: specs.socket || null,
    ram_type: specs.ram_type || null,
    gpu_length_mm: toNumber(specs.gpu_length_mm),
    supported_gpu_length_mm: toNumber(specs.supported_gpu_length_mm),
    storage_type: specs.storage_type || null,
    interface: specs.interface || null,
    capacity_gb: toNumber(specs.capacity_gb),
    benchmark_score: estimateBenchmarkScore(row, specs),
  }
}

function stockRank(status) {
  const normalized = lower(status)
  if (normalized === 'in stock') return 0
  if (normalized === 'limited') return 1
  return 2
}

function parseList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function queryAll(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows || [])))
  })
}

function queryGet(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row || null)))
  })
}

async function loadPartsByCategory(db, category) {
  const rows = await queryAll(
    db,
    'SELECT * FROM pc_parts WHERE LOWER(category) = LOWER(?) ORDER BY price ASC, part_name ASC',
    [category]
  )
  return rows.map(normalizePart)
}

async function getBestStoreForPart(db, partId) {
  const rows = await queryAll(
    db,
    `SELECT sa.price, sa.stock_status, s.store_id, s.store_name, s.store_location
     FROM store_availability sa
     INNER JOIN stores s ON s.store_id = sa.store_id
     WHERE sa.part_id = ?
     ORDER BY CASE WHEN LOWER(sa.stock_status) = 'in stock' THEN 0 WHEN LOWER(sa.stock_status) = 'limited' THEN 1 ELSE 2 END,
              sa.price ASC,
              s.store_name ASC`,
    [partId]
  )

  return rows[0] || null
}

async function getBestStoreForBuild(db, selectedParts) {
  const partIds = selectedParts.map((part) => part.part_id)
  if (partIds.length === 0) return null

  const placeholders = partIds.map(() => '?').join(', ')
  const rows = await queryAll(
    db,
    `SELECT sa.store_id, s.store_name, s.store_location, sa.part_id, sa.price, sa.stock_status
     FROM store_availability sa
     INNER JOIN stores s ON s.store_id = sa.store_id
     WHERE sa.part_id IN (${placeholders})`,
    partIds
  )

  const byStore = new Map()
  for (const row of rows) {
    if (!byStore.has(row.store_id)) {
      byStore.set(row.store_id, {
        store_id: row.store_id,
        store_name: row.store_name,
        store_location: row.store_location,
        prices: new Map(),
        statuses: [],
      })
    }
    const entry = byStore.get(row.store_id)
    entry.prices.set(row.part_id, toNumber(row.price))
    entry.statuses.push(lower(row.stock_status))
  }

  const candidates = []
  for (const entry of byStore.values()) {
    if (entry.prices.size !== partIds.length) continue
    let totalPrice = 0
    for (const price of entry.prices.values()) {
      totalPrice += price
    }
    const storeScore = entry.statuses.reduce((acc, status) => acc + stockRank(status), 0)
    candidates.push({
      store_id: entry.store_id,
      store_name: entry.store_name,
      store_location: entry.store_location,
      total_price: totalPrice,
      store_score: storeScore,
    })
  }

  candidates.sort((a, b) => a.store_score - b.store_score || a.total_price - b.total_price || a.store_name.localeCompare(b.store_name))
  return candidates[0] || null
}

function matchesBrand(part, preferredBrand) {
  if (!preferredBrand) return true
  const target = lower(preferredBrand)
  return lower(part.brand).includes(target) || lower(part.model).includes(target) || lower(part.part_name).includes(target)
}

function matchesStoragePreference(part, storagePreference) {
  if (!storagePreference) return true
  const target = lower(storagePreference)
  return lower(part.storage_type).includes(target) || lower(part.interface).includes(target) || lower(part.part_name).includes(target)
}

function buildCompatibilityMessages(build, estimatedWatt) {
  const messages = ['Compatible', 'Socket matched', 'RAM type matched', 'GPU fits case']
  if (build.psu.watt < estimatedWatt * 1.35) {
    messages.push('PSU wattage needs more headroom')
  } else {
    messages.push('PSU wattage sufficient')
  }
  return messages
}

function calculateBuildScore(build, budget, useCase) {
  const cpuScore = toNumber(build.cpu.benchmark_score)
  const gpuScore = toNumber(build.gpu.benchmark_score)
  const boardScore = toNumber(build.motherboard.benchmark_score)
  const ramScore = toNumber(build.ram.benchmark_score)
  const storageScore = toNumber(build.storage.benchmark_score)

  const rawScore = cpuScore * 0.34 + gpuScore * 0.42 + boardScore * 0.08 + ramScore * 0.08 + storageScore * 0.08
  const useCaseBoost = useCase === 'gaming' ? 1.12 : useCase === 'workstation' ? 1.08 : 1.03
  const budgetBoost = budget > 0
    ? build.total_price <= budget
      ? 1 + ((budget - build.total_price) / Math.max(budget, 1)) * 0.22
      : 0.84
    : 1

  return Math.round(rawScore * useCaseBoost * budgetBoost)
}

async function buildCandidateCombinations(db, input) {
  const [cpus, gpus, motherboards, rams, storages, psus, cases] = await Promise.all([
    loadPartsByCategory(db, 'CPU'),
    loadPartsByCategory(db, 'GPU'),
    loadPartsByCategory(db, 'Motherboard'),
    loadPartsByCategory(db, 'RAM'),
    loadPartsByCategory(db, 'Storage'),
    loadPartsByCategory(db, 'PSU'),
    loadPartsByCategory(db, 'Case'),
  ])

  const preferredBrand = lower(input.preferred_brand)
  const storagePreference = lower(input.storage_preference)
  const filteredCpus = cpus.filter((part) => matchesBrand(part, preferredBrand))
  const filteredGpus = gpus.filter((part) => matchesBrand(part, preferredBrand))
  const filteredStorages = storages.filter((part) => matchesStoragePreference(part, storagePreference))
  const storagePool = filteredStorages.length ? filteredStorages : storages
  const budget = toNumber(input.budget, 0)
  const useCase = lower(input.use_case) || 'gaming'

  const combinations = []

  for (const cpu of filteredCpus) {
    const motherboardChoices = motherboards.filter((board) => lower(board.socket) === lower(cpu.socket))
    for (const motherboard of motherboardChoices) {
      const ramChoices = rams.filter((ram) => lower(ram.ram_type) === lower(motherboard.ram_type))
      for (const ram of ramChoices) {
        for (const gpu of filteredGpus) {
          const caseChoices = cases.filter(
            (pcCase) => toNumber(pcCase.supported_gpu_length_mm) >= toNumber(gpu.gpu_length_mm)
          )

          for (const pcCase of caseChoices) {
            const estimatedWatt =
              toNumber(cpu.watt) + toNumber(motherboard.watt) + toNumber(ram.watt) + toNumber(gpu.watt) + 75
            const psuChoices = psus.filter((psu) => toNumber(psu.watt) >= Math.round(estimatedWatt * 1.35))

            for (const psu of psuChoices) {
              for (const storage of storagePool) {
                const totalPrice =
                  toNumber(cpu.price) +
                  toNumber(motherboard.price) +
                  toNumber(ram.price) +
                  toNumber(gpu.price) +
                  toNumber(pcCase.price) +
                  toNumber(psu.price) +
                  toNumber(storage.price)

                const build = {
                  id: [cpu.part_id, motherboard.part_id, ram.part_id, gpu.part_id, pcCase.part_id, psu.part_id, storage.part_id].join('-'),
                  cpu,
                  motherboard,
                  ram,
                  gpu,
                  case: pcCase,
                  psu,
                  storage,
                  total_watt: estimatedWatt,
                  total_price: totalPrice,
                }

                build.performance_score = calculateBuildScore(build, budget, useCase)
                build.compatibility_status = 'Compatible'
                build.compatibility_messages = buildCompatibilityMessages(build, estimatedWatt)
                build.available_store = null

                combinations.push(build)
              }
            }
          }
        }
      }
    }
  }

  return combinations
}

function distinctPick(builds, comparator, usedIds = new Set()) {
  const sorted = [...builds].sort(comparator)
  for (const build of sorted) {
    if (!usedIds.has(build.id)) {
      usedIds.add(build.id)
      return build
    }
  }
  return null
}

function buildSummary(build) {
  return {
    id: build.id,
    cpu: build.cpu,
    motherboard: build.motherboard,
    ram: build.ram,
    gpu: build.gpu,
    case: build.case,
    psu: build.psu,
    storage: build.storage,
    total_watt: build.total_watt,
    total_price: build.total_price,
    performance_score: build.performance_score,
    compatibility_status: build.compatibility_status,
    compatibility_messages: build.compatibility_messages,
    available_store: build.available_store,
    name: `${build.cpu.part_name} + ${build.gpu.part_name}`,
  }
}

function smartBuilderRoutes(db) {
  const router = express.Router()

  router.get('/options/:step', async (req, res) => {
    try {
      const step = lower(req.params.step)
      const stepMap = {
        cpu: 'CPU',
        gpu: 'GPU',
        motherboard: 'Motherboard',
        ram: 'RAM',
        storage: 'Storage',
        psu: 'PSU',
        case: 'Case',
      }

      const category = stepMap[step]
      if (!category) {
        return res.status(400).json({ error: 'Unsupported step' })
      }

      const options = await loadPartsByCategory(db, category)
      const cpuSpecs = req.query.cpuId ? parseJson((await queryGet(db, 'SELECT specs_json FROM pc_parts WHERE part_id = ?', [req.query.cpuId]))?.specs_json, {}) : null
      const cpuSocket = lower(cpuSpecs?.socket)
      const motherboardId = req.query.motherboardId ? Number(req.query.motherboardId) : null
      const gpuId = req.query.gpuId ? Number(req.query.gpuId) : null
      const estimatedWatt = req.query.estimatedWatt ? Number(req.query.estimatedWatt) : null

      let filtered = options

      if (step === 'motherboard' && cpuSocket) {
        filtered = filtered.filter((part) => lower(part.socket) === cpuSocket)
      }

      if (step === 'ram' && motherboardId) {
        const motherboard = await queryGet(db, 'SELECT specs_json FROM pc_parts WHERE part_id = ?', [motherboardId])
        const motherboardSpecs = parseJson(motherboard?.specs_json, {})
        filtered = filtered.filter((part) => lower(part.ram_type) === lower(motherboardSpecs.ram_type))
      }

      if (step === 'gpu' && req.query.caseId) {
        const caseRow = await queryGet(db, 'SELECT specs_json FROM pc_parts WHERE part_id = ?', [req.query.caseId])
        const caseSpecs = parseJson(caseRow?.specs_json, {})
        filtered = filtered.filter((part) => toNumber(part.gpu_length_mm) <= toNumber(caseSpecs.supported_gpu_length_mm))
      }

      if (step === 'case' && gpuId) {
        const gpuRow = await queryGet(db, 'SELECT specs_json FROM pc_parts WHERE part_id = ?', [gpuId])
        const gpuSpecs = parseJson(gpuRow?.specs_json, {})
        filtered = filtered.filter(
          (part) => toNumber(part.supported_gpu_length_mm) >= toNumber(gpuSpecs.gpu_length_mm)
        )
      }

      if (step === 'psu' && estimatedWatt) {
        filtered = filtered.filter((part) => toNumber(part.watt) >= Math.round(toNumber(estimatedWatt) * 1.35))
      }

      const enriched = await Promise.all(
        filtered.map(async (part) => ({
          ...part,
          available_store: await getBestStoreForPart(db, part.part_id),
        }))
      )

      res.json(enriched)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  router.post('/compatibility-check', async (req, res) => {
    try {
      const payload = req.body || {}

      function normalizeIncomingPart(part) {
        if (!part) return null
        const specs = part.specs && typeof part.specs === 'object' ? part.specs : parseJson(part.specs_json, {})

        return {
          part_id: part.part_id || part.id || null,
          id: part.id || part.part_id || null,
          category: part.category || null,
          part_name: part.part_name || part.model || part.label || '',
          brand: part.brand || null,
          model: part.model || part.part_name || null,
          price: toNumber(part.price),
          watt: toNumber(part.watt || part.wattage),
          stock_status: part.stock_status || null,
          specs,
          socket: part.socket || specs.socket || null,
          ram_type: part.ram_type || specs.ram_type || null,
          gpu_length_mm: toNumber(part.gpu_length_mm || specs.gpu_length_mm),
          supported_gpu_length_mm: toNumber(part.supported_gpu_length_mm || specs.supported_gpu_length_mm),
          storage_type: part.storage_type || specs.storage_type || null,
          interface: part.interface || specs.interface || null,
          capacity_gb: toNumber(part.capacity_gb || specs.capacity_gb),
          benchmark_score: toNumber(part.benchmark_score),
        }
      }

      const resolvePart = async (key) => {
        if (payload[key] && (payload[key].part_id || payload[key].id)) return normalizeIncomingPart(payload[key])
        if (payload[`${key}Id`]) {
          const row = await queryGet(db, 'SELECT * FROM pc_parts WHERE part_id = ?', [payload[`${key}Id`]])
          return row ? normalizePart(row) : null
        }
        return null
      }

      const cpu = payload.cpu ? normalizeIncomingPart(payload.cpu) : await resolvePart('cpu')
      const motherboard = payload.motherboard ? normalizeIncomingPart(payload.motherboard) : await resolvePart('motherboard')
      const ram = payload.ram ? normalizeIncomingPart(payload.ram) : await resolvePart('ram')
      const gpu = payload.gpu ? normalizeIncomingPart(payload.gpu) : await resolvePart('gpu')
      const pcCase = payload.case ? normalizeIncomingPart(payload.case) : await resolvePart('case')
      const psu = payload.psu ? normalizeIncomingPart(payload.psu) : await resolvePart('psu')

      const issues = []
      const messages = []

      if (cpu && motherboard && lower(cpu.socket) !== lower(motherboard.socket)) {
        issues.push('CPU socket mismatch')
      } else if (cpu && motherboard) {
        messages.push('Socket matched')
      }

      if (motherboard && ram && lower(motherboard.ram_type) !== lower(ram.ram_type)) {
        issues.push('RAM type mismatch')
      } else if (motherboard && ram) {
        messages.push('RAM type matched')
      }

      if (gpu && pcCase && toNumber(gpu.gpu_length_mm) > toNumber(pcCase.supported_gpu_length_mm)) {
        issues.push('GPU does not fit the selected case')
      } else if (gpu && pcCase) {
        messages.push('GPU fits case')
      }

      const totalWatt = toNumber(payload.total_watt, 0) ||
        toNumber(cpu?.watt, 0) + toNumber(motherboard?.watt, 0) + toNumber(ram?.watt, 0) + toNumber(gpu?.watt, 0) + 75

      if (psu && totalWatt && toNumber(psu.watt) < Math.round(totalWatt * 1.35)) {
        issues.push('PSU wattage insufficient')
      } else if (psu && totalWatt) {
        messages.push('PSU wattage sufficient')
      }

      const compatible = issues.length === 0
      if (compatible) {
        messages.unshift('Compatible')
      }

      res.json({
        compatible,
        issues,
        messages,
        payload: {
          cpu_socket: cpu?.socket || null,
          motherboard_socket: motherboard?.socket || null,
          motherboard_ram_type: motherboard?.ram_type || null,
          ram_type: ram?.ram_type || null,
          gpu_length_mm: gpu?.gpu_length_mm || null,
          case_gpu_limit_mm: pcCase?.supported_gpu_length_mm || null,
          psu_watt: psu?.watt || null,
          estimated_watt: totalWatt || null,
        },
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  async function handleRecommend(req, res) {
    try {
      const budget = toNumber(req.body?.budget, 0)
      const useCase = lower(req.body?.use_case || 'gaming')
      const preferredBrand = req.body?.preferred_brand || ''
      const storagePreference = req.body?.storage_preference || ''

      const combinations = await buildCandidateCombinations(db, {
        budget,
        use_case: useCase,
        preferred_brand: preferredBrand,
        storage_preference: storagePreference,
      })

      if (!combinations.length) {
        return res.status(503).json({ error: 'No compatible builds found in the demo catalog' })
      }

      for (const build of combinations) {
        build.available_store = await getBestStoreForBuild(db, [build.cpu, build.motherboard, build.ram, build.gpu, build.case, build.psu, build.storage])
      }

      const budgetCap = budget > 0 ? budget * 1.15 : Infinity
      const budgetAwarePool = combinations.filter((build) => build.total_price <= budgetCap)
      const selectionPool = budgetAwarePool.length >= 3 ? budgetAwarePool : combinations

      const usedIds = new Set()
      const performance = distinctPick(
        selectionPool,
        (a, b) => b.performance_score - a.performance_score || a.total_price - b.total_price,
        usedIds
      )
      const balanced = distinctPick(
        selectionPool,
        (a, b) => Math.abs(a.total_price - budget) - Math.abs(b.total_price - budget) || b.performance_score - a.performance_score,
        usedIds
      )
      const value = distinctPick(
        selectionPool,
        (a, b) => a.total_price - b.total_price || b.performance_score - a.performance_score,
        usedIds
      )

      const chosen = [performance, balanced, value].filter(Boolean)
      const recommendations = chosen.map((build, index) => ({
        label: index === 0 ? 'Performance Build' : index === 1 ? 'Balanced Build' : 'Value Build',
        build: buildSummary(build),
      }))

      const comparison = recommendations.map((item) => ({
        label: item.label,
        name: item.build.name,
        cpu: item.build.cpu.part_name,
        gpu: item.build.gpu.part_name,
        ram: item.build.ram.part_name,
        storage: item.build.storage.part_name,
        psu: item.build.psu.part_name,
        total_price: item.build.total_price,
        performance_score: item.build.performance_score,
        compatibility_status: item.build.compatibility_status,
        available_store: item.build.available_store,
      }))

      res.json({
        budget,
        use_case: useCase,
        preferred_brand: preferredBrand || null,
        storage_preference: storagePreference || null,
        recommendations,
        top_three: chosen.map(buildSummary),
        comparison,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  router.post('/recommend', handleRecommend)
  router.post('/recommend-builds', handleRecommend)

  return router
}

module.exports = smartBuilderRoutes