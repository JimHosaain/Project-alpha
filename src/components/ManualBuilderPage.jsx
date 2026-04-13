import { useMemo, useState } from 'react'

const componentOptions = {
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

function ManualBuilderPage({ onBack, presetId = 'manual', budget = 85000 }) {
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

  const selections = useMemo(() => {
    return componentRows.map((row) => {
      const list = componentOptions[row.key]
      const current = list[selectedIndex[row.key]]
      return { ...row, current }
    })
  }, [selectedIndex])

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

  const cycleOption = (key) => {
    const options = componentOptions[key]
    setSelectedIndex((current) => ({
      ...current,
      [key]: (current[key] + 1) % options.length,
    }))
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

          <button type="button" className="builder-next-btn manual-final-btn">
            Save this build
          </button>
        </aside>
      </div>
    </section>
  )
}

export default ManualBuilderPage
