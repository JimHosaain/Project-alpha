import { useEffect, useMemo, useState } from 'react'
import { listParts, saveBuild } from '../api'

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
    label: part.part_name,
    price: Number(part.price) || 0,
    watt: Number(part.watt) || 0,
  }

  if (specs.capacity != null) {
    option.capacity = Number(specs.capacity) || 0
  }

  return option
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

function ManualBuilderPage({ onBack, presetId = 'manual', budget = 85000, presetBuild = null }) {
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
  const compatible = psuCapacity >= Math.round(totalWatt * 1.35)

  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState(null)
  const [presetApplied, setPresetApplied] = useState(false)

  useEffect(() => {
    setPresetApplied(false)
  }, [presetBuild, presetId])

  const cycleOption = (key) => {
    const options = catalog[key] || defaultComponentOptions[key]
    setSelectedIndex((current) => ({
      ...current,
      [key]: (current[key] + 1) % options.length,
    }))
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
        <div>
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

      <div className="manual-builder-layout">
        <div className="manual-component-list">
          {selections.map((item) => (
            <article className="manual-component-item" key={item.key}>
              <div className="manual-item-title">
                <strong>{item.label}</strong>
                <span>{item.note}</span>
              </div>

              <div className="manual-item-selected">
                <p>{item.current.label}</p>
                <span>{toMoney(item.current.price)}</span>
              </div>

              <button type="button" className="manual-change-btn" onClick={() => cycleOption(item.key)}>
                Change
              </button>
            </article>
          ))}
        </div>

        <aside className="manual-summary-panel">
          <h3>Build summary</h3>

          <div className="manual-summary-line">
            <span>Total price</span>
            <strong>{toMoney(totalPrice)}</strong>
          </div>
          <div className="manual-summary-line">
            <span>Estimated wattage</span>
            <strong>{totalWatt}W</strong>
          </div>
          <div className="manual-summary-line">
            <span>PSU capacity</span>
            <strong>{psuCapacity}W</strong>
          </div>
          <div className="manual-summary-line">
            <span>Compatibility</span>
            <strong className={compatible ? 'is-ok' : 'is-risk'}>
              {compatible ? 'Good' : 'Needs higher PSU'}
            </strong>
          </div>

          <button
            type="button"
            className="builder-next-btn manual-final-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : savedId ? 'Saved ✓' : 'Save this build'}
          </button>
        </aside>
      </div>
    </section>
  )
}

export default ManualBuilderPage
