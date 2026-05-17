const express = require('express')

function toNumber(value, fallback = 0) {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

function parseList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function scoreBuild(build) {
  const totalPrice = Math.max(1, build.total_price)
  const cpuScore = build.cpu?.benchmark_score || 0
  const gpuScore = build.gpu?.benchmark_score || 0
  return (cpuScore + gpuScore) / totalPrice
}

function normalizeRows(rows, componentType) {
  return rows.map((row) => ({
    component_type: componentType,
    id: row.id,
    brand: row.brand,
    model: row.model,
    benchmark_score: toNumber(row.benchmark_score),
    price: toNumber(row.price),
    wattage: toNumber(row.wattage),
    stock_status: row.stock_status,
    raw: row,
  }))
}

function buildCompatibilityPayload(selected) {
  return {
    cpu_socket: selected.cpu?.socket || null,
    motherboard_socket: selected.motherboard?.socket || null,
    motherboard_ram_type: selected.motherboard?.ram_type || null,
    ram_type: selected.ram?.ram_type || null,
    gpu_length_mm: selected.gpu?.gpu_length_mm || null,
    case_gpu_limit_mm: selected.case?.supported_gpu_length_mm || null,
    psu_watt: selected.psu?.wattage || null,
    estimated_watt: selected.estimated_watt || null,
    cooler_socket_support: selected.cooler?.socket_support || null,
  }
}

function smartBuilderRoutes(db) {
  const router = express.Router()

  function queryAsync(sql, params = []) {
    return new Promise((resolve, reject) => db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows))))
  }

  async function getBestStoreEntry(component_type, component_id) {
    const sql = `SELECT price, stock_status, store_id, source_url FROM smart_store_availability WHERE component_type = ? AND component_id = ? ORDER BY CASE WHEN stock_status='in_stock' THEN 0 WHEN stock_status='limited' THEN 1 ELSE 2 END, price ASC LIMIT 1`
    const rows = await queryAsync(sql, [component_type, component_id])
    return rows && rows[0] ? rows[0] : null
  }

  router.get('/options/:step', (req, res) => {
    const step = String(req.params.step || '').toLowerCase()
    const selected = {
      cpu: req.query.cpuId,
      motherboard: req.query.motherboardId,
      cooler: req.query.coolerId,
      ram: req.query.ramId,
      gpu: req.query.gpuId,
      psu: req.query.psuId,
      storage: req.query.storageId,
      case: req.query.caseId,
      estimated_watt: req.query.estimatedWattage,
    }

    const tables = {
      cpu: 'cpu_catalog',
      motherboard: 'motherboard_catalog',
      cooler: 'cooler_catalog',
      ram: 'ram_catalog',
      gpu: 'gpu_catalog',
      psu: 'psu_catalog',
      storage: 'storage_catalog',
      case: 'case_catalog',
    }

    const table = tables[step]
    if (!table) return res.status(400).json({ error: 'Unsupported step' })

    db.query(`SELECT * FROM ${table} ORDER BY benchmark_score DESC, price ASC`, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      const payload = normalizeRows(rows, step)
      let filtered = payload

      if (step === 'motherboard' && selected.cpu) {
        filtered = filtered.filter((row) => String(row.raw.socket) === String(selected.cpu))
      }
      if (step === 'cooler' && selected.cpu) {
        filtered = filtered.filter((row) => parseList(row.raw.socket_support).includes(String(selected.cpu)))
      }
      if (step === 'ram' && selected.motherboard) {
        filtered = filtered.filter((row) => String(row.raw.ram_type) === String(selected.motherboard))
      }
      if (step === 'gpu' && selected.case) {
        filtered = filtered.filter((row) => toNumber(row.raw.gpu_length_mm) <= toNumber(selected.case))
      }
      if (step === 'psu' && selected.estimated_watt) {
        filtered = filtered.filter((row) => toNumber(row.raw.wattage) >= Math.round(toNumber(selected.estimated_watt) * 1.35))
      }
      if (step === 'case' && selected.gpu) {
        filtered = filtered.filter((row) => toNumber(row.raw.supported_gpu_length_mm) >= toNumber(selected.gpu))
      }

      res.json(filtered)
    })
  })

  router.post('/compatibility-check', (req, res) => {
    const selected = req.body || {}
    const issues = []

    if (selected.cpu && selected.motherboard && selected.cpu.socket !== selected.motherboard.socket) {
      issues.push('CPU socket must match motherboard socket')
    }
    if (selected.motherboard && selected.ram && selected.motherboard.ram_type !== selected.ram.ram_type) {
      issues.push('RAM type must match motherboard supported RAM type')
    }
    if (selected.gpu && selected.case && toNumber(selected.gpu.gpu_length_mm) > toNumber(selected.case.supported_gpu_length_mm)) {
      issues.push('GPU length must fit inside the selected case')
    }
    if (selected.cooler && selected.cpu && !parseList(selected.cooler.socket_support).includes(String(selected.cpu.socket))) {
      issues.push('Cooler socket compatibility check failed')
    }
    if (selected.psu && selected.total_watt && toNumber(selected.psu.wattage) < Math.round(toNumber(selected.total_watt) * 1.35)) {
      issues.push('PSU watt is not sufficient for the estimated system draw')
    }

    res.json({
      compatible: issues.length === 0,
      issues,
      payload: buildCompatibilityPayload(selected),
    })
  })

  // compatibility helper endpoints
  router.get('/compatible-motherboards/:cpuId', async (req, res) => {
    try {
      const cpuId = Number(req.params.cpuId)
      const cpuRows = await queryAsync('SELECT * FROM cpu_catalog WHERE id = ?', [cpuId])
      if (!cpuRows || !cpuRows[0]) return res.status(404).json({ error: 'CPU not found' })
      const cpu = cpuRows[0]
      const mbs = await queryAsync('SELECT * FROM motherboard_catalog WHERE socket = ? ORDER BY price ASC', [cpu.socket])
      // attach best store info to each motherboard
      const enriched = await Promise.all(mbs.map(async (mb) => ({ ...mb, store: await getBestStoreEntry('motherboard', mb.id) })))
      // sort by in-stock store then lowest price
      enriched.sort((a, b) => {
        const aStock = (a.store && a.store.stock_status) || a.stock_status
        const bStock = (b.store && b.store.stock_status) || b.stock_status
        if (aStock === bStock) return ((a.store && a.store.price) || a.price) - ((b.store && b.store.price) || b.price)
        const rank = { in_stock: 0, limited: 1, out_of_stock: 2 }
        return (rank[aStock] || 2) - (rank[bStock] || 2)
      })
      res.json(enriched)
    } catch (err) { res.status(500).json({ error: err.message }) }
  })

  router.get('/compatible-ram/:motherboardId', async (req, res) => {
    try {
      const mbId = Number(req.params.motherboardId)
      const mbRows = await queryAsync('SELECT * FROM motherboard_catalog WHERE id = ?', [mbId])
      if (!mbRows || !mbRows[0]) return res.status(404).json({ error: 'Motherboard not found' })
      const mb = mbRows[0]
      const rams = await queryAsync('SELECT * FROM ram_catalog WHERE ram_type = ? ORDER BY price ASC', [mb.ram_type])
      const enriched = await Promise.all(rams.map(async (r) => ({ ...r, store: await getBestStoreEntry('ram', r.id) })))
      enriched.sort((a, b) => {
        const aStock = (a.store && a.store.stock_status) || a.stock_status
        const bStock = (b.store && b.store.stock_status) || b.stock_status
        if (aStock === bStock) return ((a.store && a.store.price) || a.price) - ((b.store && b.store.price) || b.price)
        const rank = { in_stock: 0, limited: 1, out_of_stock: 2 }
        return (rank[aStock] || 2) - (rank[bStock] || 2)
      })
      res.json(enriched)
    } catch (err) { res.status(500).json({ error: err.message }) }
  })

  router.post('/power-check', async (req, res) => {
    try {
      const selected = req.body || {}
      // compute estimated watt from provided component ids or provided estimated_watt
      let total = 0
      const parts = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'case', 'cooler']
      for (const p of parts) {
        const id = selected[`${p}Id`] || selected[p]?.id
        if (id) {
          const table = `${p}_catalog`
          const rows = await queryAsync(`SELECT * FROM ${table} WHERE id = ?`, [id])
          if (rows && rows[0]) total += toNumber(rows[0].wattage || rows[0].watt || 0)
        }
      }
      const estimated = selected.estimated_watt || total
      const psuId = selected.psuId || selected.psu?.id
      let psu = null
      if (psuId) {
        const rows = await queryAsync('SELECT * FROM psu_catalog WHERE id = ?', [psuId])
        psu = rows && rows[0]
      }
      const required = Math.round(toNumber(estimated) * 1.35)
      res.json({ estimated_watt: estimated, recommended_psu_watt: required, psu, ok: psu ? toNumber(psu.wattage || psu.watt) >= required : false })
    } catch (err) { res.status(500).json({ error: err.message }) }
  })

  async function handleRecommend(req, res) {
    try {
      const budget = toNumber(req.body?.budget, 0)
      const useCase = String(req.body?.use_case || 'gaming').toLowerCase()
      const preferredBrand = String(req.body?.preferred_brand || '').toLowerCase()
      const storagePreference = String(req.body?.storage_preference || '').toLowerCase()

      const [cpus, gpus, motherboards, rams, storages, psus, cases, coolers] = await Promise.all([
        queryAsync('SELECT * FROM cpu_catalog ORDER BY benchmark_score DESC, price ASC'),
        queryAsync('SELECT * FROM gpu_catalog ORDER BY benchmark_score DESC, price ASC'),
        queryAsync('SELECT * FROM motherboard_catalog ORDER BY benchmark_score DESC, price ASC'),
        queryAsync('SELECT * FROM ram_catalog ORDER BY benchmark_score DESC, price ASC'),
        queryAsync('SELECT * FROM storage_catalog ORDER BY benchmark_score DESC, price ASC'),
        queryAsync('SELECT * FROM psu_catalog ORDER BY benchmark_score DESC, price ASC'),
        queryAsync('SELECT * FROM case_catalog ORDER BY benchmark_score DESC, price ASC'),
        queryAsync('SELECT * FROM cooler_catalog ORDER BY benchmark_score DESC, price ASC'),
      ])

      const cpuCandidates = cpus.filter((row) => !preferredBrand || String(row.brand).toLowerCase().includes(preferredBrand) || String(row.model).toLowerCase().includes(preferredBrand))
      const gpuCandidates = gpus.filter((row) => !preferredBrand || String(row.brand).toLowerCase().includes(preferredBrand) || String(row.model).toLowerCase().includes(preferredBrand))
      const storageCandidates = storages.filter((row) => !storagePreference || String(row.storage_type).toLowerCase().includes(storagePreference) || String(row.interface).toLowerCase().includes(storagePreference))

      const builds = []

      for (const cpu of cpuCandidates.slice(0, 12)) {
        const compatibleMBs = motherboards.filter((mb) => mb.socket === cpu.socket).slice(0, 8)
        for (const motherboard of compatibleMBs) {
          const compatibleRams = rams.filter((ram) => ram.ram_type === motherboard.ram_type).slice(0, 6)
          for (const ram of compatibleRams) {
            for (const gpu of gpuCandidates.slice(0, 10)) {
              const fittingCases = cases.filter((pcCase) => toNumber(pcCase.supported_gpu_length_mm) >= toNumber(gpu.gpu_length_mm)).slice(0, 6)
              for (const pcCase of fittingCases) {
                // estimate a small base draw for motherboard/others
                const estimatedBase = toNumber(cpu.wattage || cpu.watt || 0) + toNumber(gpu.wattage || gpu.watt || 0) + toNumber(ram.wattage || ram.watt || 0) + 75
                const candidatePSUs = psus.filter((psu) => toNumber(psu.wattage || psu.watt) >= Math.round(estimatedBase * 1.35)).slice(0, 6)
                for (const psu of candidatePSUs) {
                  const candidateStorages = (storageCandidates.length ? storageCandidates : storages).slice(0, 4)
                  for (const storage of candidateStorages) {
                    const cooler = coolers.find((item) => parseList(item.socket_support).includes(cpu.socket)) || coolers[0]
                    // compatibility strict checks
                    if (!parseList(cooler.socket_support).includes(String(cpu.socket))) continue
                    if (toNumber(pcCase.supported_gpu_length_mm) < toNumber(gpu.gpu_length_mm)) continue
                    const totalPrice = toNumber(cpu.price) + toNumber(motherboard.price) + toNumber(ram.price) + toNumber(gpu.price) + toNumber(pcCase.price) + toNumber(psu.price) + toNumber(storage.price) + toNumber(cooler.price || 0)
                    if (budget && totalPrice > budget) continue
                    const totalWattage = toNumber(cpu.wattage || cpu.watt || 0) + toNumber(motherboard.wattage || motherboard.watt || 0) + toNumber(ram.wattage || ram.watt || 0) + toNumber(gpu.wattage || gpu.watt || 0) + toNumber(pcCase.wattage || pcCase.watt || 0) + toNumber(psu.wattage || psu.watt || 0) + toNumber(storage.wattage || storage.watt || 0) + toNumber(cooler.wattage || cooler.watt || 0)

                    // scoring
                    const cpuScore = toNumber(cpu.benchmark_score)
                    const gpuScore = toNumber(gpu.benchmark_score)
                    const baseScore = (cpuScore + gpuScore) / Math.max(1, totalPrice)
                    const budgetEfficiency = budget ? 1 + Math.max(0, (budget - totalPrice) / Math.max(1, budget)) * 0.5 : 1
                    const useCaseBoost = useCase === 'gaming' ? 1.12 : useCase === 'editing' ? 1.07 : useCase === 'streaming' ? 1.03 : 1
                    const ratio = cpuScore && gpuScore ? Math.min(cpuScore / gpuScore, gpuScore / cpuScore) : 1
                    const bottleneckPenalty = ratio < 0.6 ? 0.85 : 1
                    let score = baseScore * budgetEfficiency * useCaseBoost * bottleneckPenalty

                    // small boost if components are in local stores and in stock
                    const cpuStore = await getBestStoreEntry('cpu', cpu.id)
                    const gpuStore = await getBestStoreEntry('gpu', gpu.id)
                    if ((cpuStore && cpuStore.stock_status === 'in_stock') || cpu.stock_status === 'in_stock') score *= 1.02
                    if ((gpuStore && gpuStore.stock_status === 'in_stock') || gpu.stock_status === 'in_stock') score *= 1.03

                    builds.push({
                      name: `${cpu.model} + ${gpu.model}`,
                      total_price: totalPrice,
                      total_watt: totalWattage,
                      score,
                      cpu,
                      gpu,
                      motherboard,
                      ram,
                      storage,
                      psu,
                      case: pcCase,
                      cooler,
                    })
                  }
                }
              }
            }
          }
        }
      }

      const sorted = builds.sort((a, b) => b.score - a.score)
      const topThree = sorted.slice(0, 3)
      const best = topThree[0] || null
      const balanced = sorted.reduce((acc, cur) => (Math.abs(cur.total_price - (budget || (cur.total_price * 1.1))) < Math.abs((acc?.total_price || 0) - (budget || (cur.total_price * 1.1))) ? cur : acc), best)
      const budgetOptimized = sorted.reduce((acc, cur) => (cur.total_price <= (budget || Infinity) && (!acc || cur.total_price < acc.total_price) ? cur : acc), best)

      const recommendations = [
        { label: 'Best Performance Build', build: best },
        { label: 'Balanced Build', build: balanced },
        { label: 'Budget Optimized Build', build: budgetOptimized },
      ].filter((item) => item.build)

      return res.json({ budget, use_case: useCase, preferred_brand: preferredBrand || null, storage_preference: storagePreference || null, recommendations, top_three: topThree })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  router.post('/recommend', handleRecommend)
  router.post('/recommend-builds', handleRecommend)

  return router
}

module.exports = smartBuilderRoutes
