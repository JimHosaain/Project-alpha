import { useEffect, useMemo, useState } from 'react'
import { listParts, saveBuild, runCompatibilityCheck } from '../api'

const defaultComponentOptions = {
  cpu: [
    { label: 'Ryzen 7 7700X', price: 31500, watt: 105 },
    { label: 'Core i7-13700F', price: 33800, watt: 125 },
  ],
  gpu: [
    { label: 'RTX 4070 Super', price: 73500, watt: 220 },
    { label: 'RX 7800 XT', price: 61200, watt: 263 },
  ],
  motherboard: [
    { label: 'B650 WiFi Board', price: 18800, watt: 45 },
    { label: 'B760 DDR5 Board', price: 17900, watt: 48 },
  ],
  ram: [
    { label: '32GB DDR5 6000', price: 10200, watt: 8 },
    { label: '32GB DDR5 5600', price: 9300, watt: 8 },
  ],
  storage: [
    { label: '1TB Gen4 NVMe', price: 8400, watt: 6 },
    { label: '2TB Gen4 NVMe', price: 13200, watt: 7 },
  ],
  psu: [
    { label: '750W Gold PSU', price: 10800, watt: 0, capacity: 750 },
    { label: '850W Gold PSU', price: 13400, watt: 0, capacity: 850 },
  ],
  case: [
    { label: 'Airflow Mid Tower', price: 6900, watt: 0 },
    { label: 'Compact Quiet Case', price: 7800, watt: 0 },
  ],
  cooling: [
    { label: '240mm AIO Cooler', price: 9600, watt: 10 },
    { label: 'Dual Tower Air Cooler', price: 6500, watt: 5 },
  ],
}

const componentRows = [
  { key: 'cpu', label: 'CPU', note: 'Recommended for balanced performance' },
  { key: 'gpu', label: 'GPU', note: 'Primary contributor for graphics and rendering' },
  { key: 'motherboard', label: 'Motherboard', note: 'Stable platform for the full build' },
  { key: 'ram', label: 'RAM', note: '32GB target for smooth multitasking' },
  { key: 'storage', label: 'Storage', note: 'Fast NVMe for OS and project files' },
  { key: 'psu', label: 'Power Supply', note: 'Keeps safe wattage headroom' },
  { key: 'case', label: 'Case', note: 'Airflow and cable room' },
  { key: 'cooling', label: 'Cooling', note: 'Maintains stable thermals under load' },
]

function normalizeCategory(category) {
  const value = String(category || '').trim().toLowerCase()
  if (value.includes('motherboard')) return 'motherboard'
  if (value.includes('gpu')) return 'gpu'
  if (value.includes('cpu')) return 'cpu'
  if (value.includes('ram')) return 'ram'
  if (value.includes('storage')) return 'storage'
  if (value.includes('psu')) return 'psu'
  if (value.includes('case')) return 'case'
  if (value.includes('cool')) return 'cooling'
  return value
}

function partToOption(part) {
  const specs = part.specs && typeof part.specs === 'object' ? part.specs : {}
  const option = {
    label: part.part_name || part.model || '',
    price: Number(part.price) || 0,
    watt: Number(part.watt) || Number(part.wattage) || 0,
    part_id: part.part_id || part.id || null,
    raw: part,
  }

  if (specs.capacity != null) {
    option.capacity = Number(specs.capacity) || 0
  }

  return option
}

function getSpecValue(item, key) {
  const raw = item?.raw || {}
  const specs = raw.specs && typeof raw.specs === 'object' ? raw.specs : {}
  return raw[key] ?? specs[key] ?? item?.[key] ?? null
}

function getItemImage(item) {
  const raw = item?.raw || {}
  return raw.image_url || raw.image || raw.thumbnail || null
}

function getPerformanceTier(score = 0) {
  if (score >= 25000) return 'Elite'
  if (score >= 16000) return 'High'
  if (score >= 9000) return 'Balanced'
  return 'Entry'
}

function getRowCompatibility(rowKey, selections) {
  const cpu = selections.find((item) => item.key === 'cpu')?.current?.raw || null
  const motherboard = selections.find((item) => item.key === 'motherboard')?.current?.raw || null
  const ram = selections.find((item) => item.key === 'ram')?.current?.raw || null
  const gpu = selections.find((item) => item.key === 'gpu')?.current?.raw || null
  const psu = selections.find((item) => item.key === 'psu')?.current || null
  const caseItem = selections.find((item) => item.key === 'case')?.current?.raw || null
  const cooler = selections.find((item) => item.key === 'cooling')?.current?.raw || null

  if (rowKey === 'motherboard' && cpu && motherboard) {
    return String(cpu.socket || '').toLowerCase() === String(motherboard.socket || '').toLowerCase()
      ? { tone: 'good', text: '✓ Compatible with selected CPU' }
      : { tone: 'warn', text: '⚠ Socket mismatch' }
  }

  if (rowKey === 'ram' && motherboard && ram) {
    return String(motherboard.ram_type || '').toLowerCase() === String(ram.ram_type || '').toLowerCase()
      ? { tone: 'good', text: `✓ ${String(ram.ram_type || '').toUpperCase()} supported` }
      : { tone: 'bad', text: '✕ RAM type mismatch' }
  }

  if (rowKey === 'psu' && psu) {
    const wattage = Number(psu.capacity || psu.wattage || psu.watt || 0)
    return wattage >= Math.round((selections.reduce((sum, item) => sum + Number(item.current?.watt || 0), 0) * 1.35))
      ? { tone: 'good', text: '✓ Recommended wattage available' }
      : { tone: 'warn', text: '⚠ Insufficient wattage' }
  }

  if (rowKey === 'case' && gpu && caseItem) {
    return Number(caseItem.supported_gpu_length_mm || 0) >= Number(gpu.gpu_length_mm || 0)
      ? { tone: 'good', text: '✓ GPU fits case' }
      : { tone: 'bad', text: '✕ GPU too large' }
  }

  if (rowKey === 'cooling' && cpu && cooler) {
    const supported = String(cooler.socket_support || '')
      .split(',')
      .map((part) => part.trim().toLowerCase())
    return supported.includes(String(cpu.socket || '').toLowerCase())
      ? { tone: 'good', text: '✓ Socket compatible' }
      : { tone: 'bad', text: '✕ Socket incompatible' }
  }

  if (rowKey === 'cpu' && cpu) {
    return { tone: 'good', text: '✓ Selected CPU' }
  }

  if (rowKey === 'gpu' && gpu) {
    return { tone: 'good', text: '✓ Selected GPU' }
  }

  if (rowKey === 'storage' && getSpecValue({ raw: selections.find((item) => item.key === 'storage')?.current?.raw }, 'storage_type')) {
    return { tone: 'good', text: '✓ Storage ready' }
  }

  return { tone: 'neutral', text: 'Ready to choose' }
}

function buildCatalog(parts) {
  const grouped = parts.reduce((acc, part) => {
    const key = normalizeCategory(part.category)
    if (!acc[key]) acc[key] = []
    acc[key].push(partToOption(part))
    return acc
  }, {})

  return Object.keys(defaultComponentOptions).reduce((acc, key) => {
    acc[key] = grouped[key]?.length ? grouped[key] : defaultComponentOptions[key]
    return acc
  }, {})
}

function findOptionIndex(options, targetPart) {
  if (!Array.isArray(options) || options.length === 0 || !targetPart) return 0
  const targetLabel = String(targetPart.part_name || targetPart.model || targetPart.label || '').toLowerCase()
  const targetBrand = String(targetPart.brand || '').toLowerCase()

  const exactMatch = options.findIndex((option) => {
    const optionLabel = String(option.label || '').toLowerCase()
    return optionLabel === targetLabel || optionLabel.includes(targetLabel) || targetLabel.includes(optionLabel)
  })

  if (exactMatch >= 0) return exactMatch

  const brandMatch = options.findIndex((option) => String(option.label || '').toLowerCase().includes(targetBrand))
  return brandMatch >= 0 ? brandMatch : 0
}

const formatMoney = new Intl.NumberFormat('en-US')

function toMoney(value) {
  return `৳${formatMoney.format(value)}`
}

function getPresetLabel(presetId) {
  if (presetId === 'elite-alpha') return 'Elite Alpha'
  if (presetId === 'swift-core') return 'Swift Core'
  if (presetId === 'nexus-stream') return 'Nexus Stream'
  return 'Manual'
}

function getRowIconLabel(rowKey) {
  const labels = {
    cpu: 'CPU',
    gpu: 'GPU',
    motherboard: 'MB',
    ram: 'RAM',
    storage: 'SSD',
    psu: 'PSU',
    case: 'CASE',
    cooling: 'CLR',
  }

  return labels[rowKey] || String(rowKey || '').slice(0, 3).toUpperCase()
}

function ManualBuilderPage({ onBack, presetId = 'manual', budget = 85000, presetBuild = null, requestOpenSelector = null }) {
  const [catalog, setCatalog] = useState(defaultComponentOptions)
  const [catalogState, setCatalogState] = useState('loading')
  const [selectedIndex, setSelectedIndex] = useState({
    cpu: 0,
    gpu: presetId === 'swift-core' ? 1 : 0,
    motherboard: 0,
    ram: 0,
    storage: 0,
    psu: presetId === 'elite-alpha' ? 1 : 0,
    case: 0,
    cooling: 0,
  })

  useEffect(() => {
    let active = true

    listParts()
      .then((rows) => {
        if (!active) return
        setCatalog(buildCatalog(rows))
        setCatalogState('ready')
      })
      .catch(() => {
        if (!active) return
        setCatalog(defaultComponentOptions)
        setCatalogState('fallback')
      })

    return () => {
      active = false
    }
  }, [])

  const selections = useMemo(() => {
    return componentRows.map((row) => {
      const list = catalog[row.key] || defaultComponentOptions[row.key]
      const current = list[selectedIndex[row.key] % list.length]
      return { ...row, current }
    })
  }, [catalog, selectedIndex])

  const [compatibility, setCompatibility] = useState({ compatible: true, issues: [] })

  useEffect(() => {
    // run compatibility check on selection changes
    async function check() {
      try {
        const payload = {}
        selections.forEach((s) => {
          if (!s.current) return
          // include raw objects when available
          if (s.current.raw) payload[s.key] = s.current.raw
          else payload[s.key] = { label: s.current.label }
        })

        const res = await runCompatibilityCheck(payload)
        setCompatibility({ compatible: !!res.compatible, issues: res.issues || [] })
      } catch (err) {
        // keep previous compatibility state on error
        console.warn('compatibility check failed', err)
      }
    }

    check()
  }, [selections])

  const totalPrice = useMemo(
    () => selections.reduce((sum, item) => sum + item.current.price, 0),
    [selections]
  )

  const totalWatt = useMemo(
    () => selections.reduce((sum, item) => sum + item.current.watt, 0),
    [selections]
  )

  const psuSelection = selections.find((item) => item.key === 'psu')?.current
  const psuCapacity = psuSelection?.capacity ?? 750
  const performanceTier = getPerformanceTier(selections.reduce((sum, item) => sum + Number(item.current?.price || 0), 0) + totalWatt * 20)

  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState(null)
  const [presetApplied, setPresetApplied] = useState(false)

  useEffect(() => {
    setPresetApplied(false)
  }, [presetBuild, presetId])

  const openSelectorFor = (key) => {
    if (typeof requestOpenSelector !== 'function') return

    // build a snapshot of current selections with optional ids/labels
    const currentSelections = {}
    Object.keys(selectedIndex).forEach((k) => {
      const opts = catalog[k] || defaultComponentOptions[k]
      currentSelections[k] = opts[selectedIndex[k] % opts.length] || null
    })
    currentSelections.estimatedWatt = totalWatt

    requestOpenSelector(key, {
      currentSelections,
      onSelect: (part) => {
        // when a part is selected from the selector overlay, find matching option index
        setSelectedIndex((cur) => ({
          ...cur,
          [key]: findOptionIndex(catalog[key] || [], part),
        }))
      },
    })
  }

  useEffect(() => {
    if (catalogState !== 'ready' || !presetBuild || presetApplied) {
      return
    }

    const nextSelectedIndex = { ...selectedIndex }
    nextSelectedIndex.cpu = findOptionIndex(catalog.cpu || [], presetBuild.cpu)
    nextSelectedIndex.gpu = findOptionIndex(catalog.gpu || [], presetBuild.gpu)
    nextSelectedIndex.motherboard = findOptionIndex(catalog.motherboard || [], presetBuild.motherboard)
    nextSelectedIndex.ram = findOptionIndex(catalog.ram || [], presetBuild.ram)
    nextSelectedIndex.storage = findOptionIndex(catalog.storage || [], presetBuild.storage)
    nextSelectedIndex.psu = findOptionIndex(catalog.psu || [], presetBuild.psu)
    nextSelectedIndex.case = findOptionIndex(catalog.case || [], presetBuild.case)
    nextSelectedIndex.cooling = findOptionIndex(catalog.cooling || [], presetBuild.cooler)

    setSelectedIndex(nextSelectedIndex)
    setPresetApplied(true)
  }, [catalog, catalogState, presetApplied, presetBuild, selectedIndex])

  const handleSave = async () => {
    setSaving(true)
    setSavedId(null)
    try {
      const build = {
        name: getPresetLabel(presetId),
        components: selections.map((s) => ({ key: s.key, label: s.current.label, price: s.current.price })),
        total_price: totalPrice,
        total_watt: totalWatt,
      }
      const res = await saveBuild(build)
      setSavedId(res.id)
    } catch (err) {
      console.error('Save failed', err)
      alert('Failed to save build: ' + (err.message || err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="manual-builder-page">
      <div className="manual-builder-head">
        <div className="manual-builder-copy">
          <p className="manual-kicker">Manual builder</p>
          <h2>Choose and tune your components.</h2>
          <p>
            Preset: {getPresetLabel(presetId)} · Budget target: {toMoney(budget)}
          </p>
          {presetBuild ? (
            <p className="manual-source-note">Loaded from the guided recommendation flow.</p>
          ) : null}
          <p className="manual-source-note">
            {catalogState === 'ready'
              ? 'Component options are loaded from the database.'
              : 'Database parts are unavailable right now, so the built-in catalog is active.'}
          </p>
        </div>
        <button type="button" className="builder-back-btn" onClick={onBack}>
          Back to budget
        </button>
      </div>

      <div className="manual-summary-row" aria-label="Build summary">
        <div className={`manual-summary-chip ${compatibility.compatible ? 'is-good' : 'is-warn'}`}>
          {compatibility.compatible ? '✓ Compatible Build' : '⚠ Compatibility Issue'}
        </div>
        <div className="manual-summary-box">
          <span>Estimated Wattage</span>
          <strong>{totalWatt}W</strong>
        </div>
        <div className="manual-summary-box">
          <span>Total Price</span>
          <strong>{toMoney(totalPrice)}</strong>
        </div>
        <div className="manual-summary-box">
          <span>Selected</span>
          <strong>{selections.filter((item) => item.current?.label).length}</strong>
        </div>
        <div className="manual-summary-box manual-summary-box--wide">
          <span>Performance Tier</span>
          <strong>{performanceTier}</strong>
        </div>
        <button
          type="button"
          className="builder-next-btn manual-final-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : savedId ? 'Saved ✓' : 'Save this build'}
        </button>
      </div>

      {!compatibility.compatible && compatibility.issues && compatibility.issues.length ? (
        <div className="manual-compat-issues">
          <ul>
            {compatibility.issues.map((iss, idx) => (
              <li key={idx} className="muted small">{iss}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="manual-builder-layout">
        <div className="manual-component-list">
          {selections.map((item) => {
            const compatibilityState = getRowCompatibility(item.key, selections)
            const hasSelection = Boolean(item.current && item.current.label)
            const img = getItemImage(item.current)
            const selectedSpecs = [
              item.key === 'cpu' ? `${getSpecValue(item.current, 'socket') || 'Socket n/a'}` : null,
              item.key === 'cpu' ? `${getSpecValue(item.current, 'core_count') || getSpecValue(item.current, 'cores') || '—'}C/${getSpecValue(item.current, 'thread_count') || getSpecValue(item.current, 'threads') || '—'}T` : null,
              item.key === 'cpu' ? `${getSpecValue(item.current, 'generation') || 'Gen n/a'}` : null,
              item.key === 'motherboard' ? `${getSpecValue(item.current, 'socket') || 'Socket n/a'}` : null,
              item.key === 'motherboard' ? `${getSpecValue(item.current, 'ram_type') || 'RAM n/a'}` : null,
              item.key === 'ram' ? `${getSpecValue(item.current, 'ram_type') || 'RAM n/a'}` : null,
              item.key === 'ram' ? `${getSpecValue(item.current, 'speed') || 'Speed n/a'}` : null,
              item.key === 'gpu' ? `${getSpecValue(item.current, 'vram') || getSpecValue(item.current, 'memory') || 'VRAM n/a'}` : null,
              item.key === 'gpu' ? `${getSpecValue(item.current, 'benchmark_score') || 'Bench n/a'}` : null,
              item.key === 'psu' ? `${getSpecValue(item.current, 'capacity') || psuCapacity}W` : null,
              item.key === 'psu' ? `${getSpecValue(item.current, 'efficiency') || 'Efficiency n/a'}` : null,
              item.key === 'case' ? `${getSpecValue(item.current, 'supported_gpu_length_mm') || 'Case fit n/a'}` : null,
              item.key === 'case' ? `${getSpecValue(item.current, 'supported_form_factor') || getSpecValue(item.current, 'form_factor') || 'Board support n/a'}` : null,
              item.key === 'cooling' ? `${getSpecValue(item.current, 'socket_support') || 'Socket support n/a'}` : null,
              item.key === 'storage' ? `${getSpecValue(item.current, 'capacity') || 'Storage'}` : null,
            ].filter(Boolean)

            return (
              <article
                className={`manual-row ${hasSelection ? 'is-selected' : ''} ${compatibilityState.tone === 'good' ? 'is-good' : compatibilityState.tone === 'warn' ? 'is-warn' : compatibilityState.tone === 'bad' ? 'is-bad' : ''}`}
                key={item.key}
              >
                <div className="manual-row-left">
                  <div className="manual-row-icon">{getRowIconLabel(item.key)}</div>
                  <div className="manual-row-labels">
                    <strong>{item.label}</strong>
                    <span>{item.note}</span>
                  </div>
                </div>

                <div className="manual-row-center">
                  {hasSelection ? (
                    <>
                      <div className="manual-row-product">
                        <div className="manual-row-media">
                          {img ? <img src={img} alt={item.current.label} /> : <div className="manual-row-placeholder" />}
                        </div>
                        <div className="manual-row-copy">
                          <p>{item.current.label}</p>
                          <span>{item.current.raw?.brand || item.current.label}</span>
                        </div>
                      </div>

                      <div className="manual-row-specs">
                        {selectedSpecs.map((spec) => <span key={spec}>{spec}</span>)}
                      </div>

                      <div className={`manual-row-badge ${compatibilityState.tone}`}>
                        {compatibilityState.text}
                      </div>
                    </>
                  ) : (
                    <div className="manual-row-placeholder-line">
                      <span />
                      <span />
                    </div>
                  )}
                </div>

                <div className="manual-row-right">
                  <strong className="manual-row-price">{hasSelection ? toMoney(item.current.price) : '—'}</strong>
                  <button
                    type="button"
                    className={`manual-change-btn ${hasSelection ? 'is-change' : 'is-choose'}`}
                    onClick={() => openSelectorFor(item.key)}
                  >
                    {hasSelection ? 'Change' : 'Choose'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ManualBuilderPage
