import { useEffect, useMemo, useState } from 'react'
import { listParts, getSmartStepOptions } from '../api'

const STORE_BADGES = ['StarTech', 'Ryans', 'TechLand', 'PCB Store']

function getStepLabel(step) {
  const labels = {
    cpu: 'CPU',
    motherboard: 'Motherboard',
    ram: 'RAM',
    gpu: 'GPU',
    psu: 'PSU',
    case: 'Case',
    cooling: 'CPU Cooler',
    storage: 'Storage',
  }

  return labels[step] || String(step || '').replace('_', ' ')
}

function getRawField(item, key) {
  const raw = item?.raw || {}
  const specs = raw.specs && typeof raw.specs === 'object' ? raw.specs : {}
  return raw[key] ?? specs[key] ?? item?.[key] ?? null
}

function parseSocketSupport(value) {
  return String(value || '')
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
}

function getCompatibilityBadge(step, item, selections) {
  const cpu = selections.cpu?.raw || null
  const motherboard = selections.motherboard?.raw || null
  const caseItem = selections.case?.raw || null
  const gpu = selections.gpu?.raw || null
  const psu = selections.psu?.raw || selections.psu || null

  if (step === 'motherboard' && cpu && item.raw) {
    return String(cpu.socket || '').toLowerCase() === String(item.raw.socket || '').toLowerCase()
      ? { tone: 'good', text: '✓ Compatible with selected CPU' }
      : { tone: 'bad', text: '✕ Incompatible socket' }
  }

  if (step === 'ram' && motherboard && item.raw) {
    return String(motherboard.ram_type || '').toLowerCase() === String(item.raw.ram_type || '').toLowerCase()
      ? { tone: 'good', text: '✓ DDR supported' }
      : { tone: 'bad', text: '✕ RAM type mismatch' }
  }

  if (step === 'psu' && psu) {
    const estimatedWatt = selections.estimatedWatt || 0
    const capacity = Number(item.raw?.wattage || item.raw?.watt || item.capacity || 0)
    return capacity >= Math.round(Number(estimatedWatt) * 1.35)
      ? { tone: 'good', text: '✓ Recommended wattage available' }
      : { tone: 'warn', text: '⚠ Requires higher wattage PSU' }
  }

  if (step === 'case' && gpu && item.raw) {
    return Number(item.raw.supported_gpu_length_mm || 0) >= Number(gpu.gpu_length_mm || 0)
      ? { tone: 'good', text: '✓ GPU fits case' }
      : { tone: 'bad', text: '✕ GPU too large' }
  }

  if (step === 'cooling' && cpu && item.raw) {
    const supportList = parseSocketSupport(item.raw.socket_support)
    return supportList.includes(String(cpu.socket || '').toLowerCase())
      ? { tone: 'good', text: '✓ Socket compatible' }
      : { tone: 'bad', text: '✕ Socket incompatible' }
  }

  if (step === 'gpu') {
    return { tone: 'good', text: '✓ Ready to compare' }
  }

  return { tone: 'neutral', text: 'Ready to add' }
}

function getStoreCoverage(item) {
  const stock = String(item.stock_status || item.raw?.stock_status || '').toLowerCase()
  return STORE_BADGES.map((name) => ({
    name,
    tone: stock === 'out_of_stock' ? 'off' : stock === 'limited' ? 'warn' : 'good',
  }))
}

function FieldGroup({ title, open = true, onToggle, children }) {
  return (
    <section className={`filter-group ${open ? 'is-open' : ''}`}>
      <header className="filter-group-head" onClick={onToggle}>
        <strong>{title}</strong>
        <span>{open ? '▾' : '▸'}</span>
      </header>
      {open ? <div className="filter-group-body">{children}</div> : null}
    </section>
  )
}

function getRowSpecs(step, item, watt, bench) {
  const specs = []

  if (step === 'cpu') {
    specs.push(`Socket: ${getRawField(item, 'socket') || 'n/a'}`)
    specs.push(`Cores/Threads: ${getRawField(item, 'core_count') || getRawField(item, 'cores') || 'n/a'} / ${getRawField(item, 'thread_count') || getRawField(item, 'threads') || 'n/a'}`)
    specs.push(`Generation: ${getRawField(item, 'generation') || 'n/a'}`)
  }

  if (step === 'motherboard') {
    specs.push(`Socket: ${getRawField(item, 'socket') || 'n/a'}`)
    specs.push(`Chipset: ${getRawField(item, 'chipset') || 'n/a'}`)
    specs.push(`RAM: ${getRawField(item, 'ram_type') || 'n/a'}`)
  }

  if (step === 'ram') {
    specs.push(`DDR: ${getRawField(item, 'ram_type') || 'n/a'}`)
    specs.push(`Speed: ${getRawField(item, 'speed') || 'n/a'}`)
    specs.push(`Capacity: ${getRawField(item, 'capacity') || 'n/a'}`)
  }

  if (step === 'gpu') {
    specs.push(`VRAM: ${getRawField(item, 'vram') || getRawField(item, 'memory') || 'n/a'}`)
    specs.push(`Power draw: ${watt || getRawField(item, 'power_draw') || 'n/a'}W`)
    specs.push(`Benchmark: ${bench || getRawField(item, 'benchmark_score') || 'n/a'}`)
  }

  if (step === 'psu') {
    specs.push(`Wattage: ${getRawField(item, 'wattage') || getRawField(item, 'watt') || 'n/a'}W`)
    specs.push(`Efficiency: ${getRawField(item, 'efficiency') || 'n/a'}`)
  }

  if (step === 'case') {
    specs.push(`GPU clearance: ${getRawField(item, 'supported_gpu_length_mm') || 'n/a'} mm`)
    specs.push(`Board support: ${getRawField(item, 'supported_form_factor') || getRawField(item, 'form_factor') || 'n/a'}`)
  }

  if (step === 'cooling') {
    specs.push(`Socket support: ${getRawField(item, 'socket_support') || 'n/a'}`)
  }

  if (step === 'storage') {
    specs.push(`Capacity: ${getRawField(item, 'capacity') || 'n/a'}`)
  }

  return specs
}

function ComponentSelector({ step, currentSelections = {}, onClose, onBack, onSelect, mode = 'overlay' }) {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [filters, setFilters] = useState({ search: '', brand: '', priceMax: 0 })
  const [openGroups, setOpenGroups] = useState({})

  useEffect(() => {
    let active = true
    setLoading(true)

    // build params from filters and current selections
    const params = {}
    if (filters.search) params.search = filters.search
    if (filters.brand) params.brand = filters.brand
    if (filters.priceMax) params.priceMax = filters.priceMax

    // compatibility helpers: pass socket or id where available
    if (currentSelections.cpu && currentSelections.cpu.raw) {
      params.cpu = currentSelections.cpu.raw.socket || currentSelections.cpu.part_id || currentSelections.cpu.raw.id
      params.cpuId = currentSelections.cpu.part_id || currentSelections.cpu.raw.id
    }
    if (currentSelections.motherboard && currentSelections.motherboard.raw) {
      params.motherboard = currentSelections.motherboard.raw.socket || currentSelections.motherboard.part_id
      params.motherboardId = currentSelections.motherboard.part_id || currentSelections.motherboard.raw.id
    }

    // add specific filter params for certain steps
    if (step === 'cpu') {
      if (filters.socket) params.socket = filters.socket
      if (filters.generation) params.generation = filters.generation
      if (filters.cores) params.cores = filters.cores
      if (filters.threads) params.threads = filters.threads
      if (filters.benchmark) params.benchmark = filters.benchmark
    }
    if (step === 'motherboard') {
      if (filters.socket) params.socket = filters.socket
      if (filters.chipset) params.chipset = filters.chipset
      if (filters.ram_type) params.ram_type = filters.ram_type
      if (filters.form_factor) params.form_factor = filters.form_factor
    }
    if (step === 'ram') {
      if (filters.ram_type) params.ram_type = filters.ram_type
      if (filters.speed) params.speed = filters.speed
      if (filters.capacity) params.capacity = filters.capacity
      if (filters.rgb !== undefined) params.rgb = filters.rgb
    }
    if (step === 'gpu') {
      if (filters.vram) params.vram = filters.vram
      if (filters.benchmark) params.benchmark = filters.benchmark
      if (filters.power_draw) params.power_draw = filters.power_draw
      if (filters.length) params.length = filters.length
      if (filters.ray_tracing !== undefined) params.ray_tracing = filters.ray_tracing
    }
    if (step === 'psu') {
      if (filters.wattage) params.wattage = filters.wattage
      if (filters.efficiency) params.efficiency = filters.efficiency
      if (filters.modularity !== undefined) params.modularity = filters.modularity
    }
    if (step === 'case') {
      if (filters.form_factor) params.form_factor = filters.form_factor
      if (filters.gpu_clearance) params.gpu_clearance = filters.gpu_clearance
      if (filters.cooling_support) params.cooling_support = filters.cooling_support
    }

    getSmartStepOptions(step, params)
      .then((rows) => {
        if (!active) return
        setItems(rows || [])
      })
      .catch(() => {
        // fallback to generic listParts
        listParts(step).then((rows) => {
          if (!active) return
          setItems(rows || [])
        })
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [step, currentSelections, filters])

  const priceMax = useMemo(() => items.reduce((m, i) => Math.max(m, Number(i.price || i.raw?.price || 0)), 0), [items])

  useEffect(() => {
    setFilters((f) => ({ ...f, priceMax }))
  }, [priceMax])

  const toggleGroup = (name) => setOpenGroups((g) => ({ ...g, [name]: !g[name] }))

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (filters.search && !String(it.model || it.part_name || it.raw?.model || '').toLowerCase().includes(filters.search.toLowerCase())) return false
      if (filters.brand && !String(it.brand || it.raw?.brand || '').toLowerCase().includes(filters.brand.toLowerCase())) return false
      if (filters.priceMax && Number(it.price || it.raw?.price || 0) > Number(filters.priceMax)) return false
      return true
    })
  }, [items, filters])

  const closeHandler = onClose || onBack

  return (
    <section className={mode === 'page' ? 'selector-page' : 'selector-overlay'}>
      <div className="selector-page-shell">
        <header className="selector-page-head">
          <div className="selector-page-title">
            <button type="button" className="selector-back-btn" onClick={closeHandler}>←</button>
            <div>
              <p className="selector-page-kicker">PC Builder</p>
              <h2>Choose a {getStepLabel(step)}</h2>
            </div>
          </div>
          <div className="selector-page-meta">
            <span>{filtered.length} items</span>
            <button type="button" onClick={closeHandler}>{mode === 'page' ? 'Back to builder' : 'Close'}</button>
          </div>
        </header>

        <div className="selector-page-body">
          <aside className="selector-sidebar">
            <div className="filter-search">
              <input type="text" placeholder="Search" value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} />
            </div>

            {step === 'cpu' ? (
              <>
                <FieldGroup title="Brand" open={openGroups.brand} onToggle={() => toggleGroup('brand')}>
                  <input placeholder="AMD, Intel" value={filters.brand} onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="Socket" open={openGroups.socket} onToggle={() => toggleGroup('socket')}>
                  <input placeholder="AM4, AM5, LGA1700" value={filters.socket || ''} onChange={(e) => setFilters((f) => ({ ...f, socket: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="Generation" open={openGroups.generation} onToggle={() => toggleGroup('generation')}>
                  <input placeholder="12th, 13th" value={filters.generation || ''} onChange={(e) => setFilters((f) => ({ ...f, generation: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="Core count" open={openGroups.cores} onToggle={() => toggleGroup('cores')}>
                  <input type="number" min="1" placeholder="Cores" value={filters.cores || ''} onChange={(e) => setFilters((f) => ({ ...f, cores: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="Thread count" open={openGroups.threads} onToggle={() => toggleGroup('threads')}>
                  <input type="number" min="1" placeholder="Threads" value={filters.threads || ''} onChange={(e) => setFilters((f) => ({ ...f, threads: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="Benchmark tier" open={openGroups.benchmark} onToggle={() => toggleGroup('benchmark')}>
                  <select value={filters.benchmark || ''} onChange={(e) => setFilters((f) => ({ ...f, benchmark: e.target.value }))}>
                    <option value="">Any</option>
                    <option value="high">High</option>
                    <option value="mid">Mid</option>
                    <option value="low">Low</option>
                  </select>
                </FieldGroup>
              </>
            ) : null}

            {step === 'motherboard' ? (
              <>
                <FieldGroup title="Socket" open={openGroups.socket} onToggle={() => toggleGroup('socket')}>
                  <input placeholder="AM4, AM5, LGA1700" value={filters.socket || ''} onChange={(e) => setFilters((f) => ({ ...f, socket: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="Chipset" open={openGroups.chipset} onToggle={() => toggleGroup('chipset')}>
                  <input placeholder="B650, Z790" value={filters.chipset || ''} onChange={(e) => setFilters((f) => ({ ...f, chipset: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="RAM Type" open={openGroups.ram_type} onToggle={() => toggleGroup('ram_type')}>
                  <input placeholder="DDR4, DDR5" value={filters.ram_type || ''} onChange={(e) => setFilters((f) => ({ ...f, ram_type: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="Form factor" open={openGroups.form_factor} onToggle={() => toggleGroup('form_factor')}>
                  <select value={filters.form_factor || ''} onChange={(e) => setFilters((f) => ({ ...f, form_factor: e.target.value }))}>
                    <option value="">Any</option>
                    <option value="ATX">ATX</option>
                    <option value="Micro-ATX">Micro-ATX</option>
                    <option value="Mini-ITX">Mini-ITX</option>
                  </select>
                </FieldGroup>
              </>
            ) : null}

            {step === 'ram' ? (
              <>
                <FieldGroup title="DDR Type" open={openGroups.ram_type} onToggle={() => toggleGroup('ram_type')}>
                  <input placeholder="DDR4 or DDR5" value={filters.ram_type || ''} onChange={(e) => setFilters((f) => ({ ...f, ram_type: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="Speed" open={openGroups.speed} onToggle={() => toggleGroup('speed')}>
                  <input placeholder="3200, 6000" value={filters.speed || ''} onChange={(e) => setFilters((f) => ({ ...f, speed: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="Capacity" open={openGroups.capacity} onToggle={() => toggleGroup('capacity')}>
                  <input placeholder="8, 16, 32" value={filters.capacity || ''} onChange={(e) => setFilters((f) => ({ ...f, capacity: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="RGB" open={openGroups.rgb} onToggle={() => toggleGroup('rgb')}>
                  <label><input type="checkbox" checked={!!filters.rgb} onChange={(e) => setFilters((f) => ({ ...f, rgb: e.target.checked }))} /> RGB</label>
                </FieldGroup>
              </>
            ) : null}

            {step === 'gpu' ? (
              <>
                <FieldGroup title="VRAM" open={openGroups.vram} onToggle={() => toggleGroup('vram')}>
                  <input placeholder="8, 12" value={filters.vram || ''} onChange={(e) => setFilters((f) => ({ ...f, vram: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="Benchmark" open={openGroups.benchmark} onToggle={() => toggleGroup('benchmark')}>
                  <select value={filters.benchmark || ''} onChange={(e) => setFilters((f) => ({ ...f, benchmark: e.target.value }))}>
                    <option value="">Any</option>
                    <option value="high">High</option>
                    <option value="mid">Mid</option>
                    <option value="low">Low</option>
                  </select>
                </FieldGroup>
                <FieldGroup title="Power draw" open={openGroups.power} onToggle={() => toggleGroup('power')}>
                  <input placeholder="200" value={filters.power_draw || ''} onChange={(e) => setFilters((f) => ({ ...f, power_draw: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="Length (mm)" open={openGroups.length} onToggle={() => toggleGroup('length')}>
                  <input placeholder="300" value={filters.length || ''} onChange={(e) => setFilters((f) => ({ ...f, length: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="Ray tracing" open={openGroups.ray} onToggle={() => toggleGroup('ray')}>
                  <label><input type="checkbox" checked={!!filters.ray_tracing} onChange={(e) => setFilters((f) => ({ ...f, ray_tracing: e.target.checked }))} /> Ray Tracing</label>
                </FieldGroup>
              </>
            ) : null}

            {step === 'psu' ? (
              <>
                <FieldGroup title="Wattage" open={openGroups.wattage} onToggle={() => toggleGroup('wattage')}>
                  <input placeholder="650" value={filters.wattage || ''} onChange={(e) => setFilters((f) => ({ ...f, wattage: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="Efficiency" open={openGroups.efficiency} onToggle={() => toggleGroup('efficiency')}>
                  <select value={filters.efficiency || ''} onChange={(e) => setFilters((f) => ({ ...f, efficiency: e.target.value }))}>
                    <option value="">Any</option>
                    <option value="80+">80+</option>
                    <option value="80+ Bronze">Bronze</option>
                    <option value="80+ Gold">Gold</option>
                    <option value="80+ Platinum">Platinum</option>
                  </select>
                </FieldGroup>
                <FieldGroup title="Modularity" open={openGroups.modularity} onToggle={() => toggleGroup('modularity')}>
                  <label><input type="checkbox" checked={!!filters.modularity} onChange={(e) => setFilters((f) => ({ ...f, modularity: e.target.checked }))} /> Modular / Semi-modular</label>
                </FieldGroup>
              </>
            ) : null}

            {step === 'case' ? (
              <>
                <FieldGroup title="Motherboard support" open={openGroups.mb} onToggle={() => toggleGroup('mb')}>
                  <select value={filters.form_factor || ''} onChange={(e) => setFilters((f) => ({ ...f, form_factor: e.target.value }))}>
                    <option value="">Any</option>
                    <option value="ATX">ATX</option>
                    <option value="Micro-ATX">Micro-ATX</option>
                    <option value="Mini-ITX">Mini-ITX</option>
                  </select>
                </FieldGroup>
                <FieldGroup title="GPU clearance (mm)" open={openGroups.gpu_clearance} onToggle={() => toggleGroup('gpu_clearance')}>
                  <input placeholder="320" value={filters.gpu_clearance || ''} onChange={(e) => setFilters((f) => ({ ...f, gpu_clearance: e.target.value }))} />
                </FieldGroup>
                <FieldGroup title="Cooling support" open={openGroups.cooling} onToggle={() => toggleGroup('cooling')}>
                  <input placeholder="240mm, 360mm" value={filters.cooling_support || ''} onChange={(e) => setFilters((f) => ({ ...f, cooling_support: e.target.value }))} />
                </FieldGroup>
              </>
            ) : null}

            <div className="filter-price">
              <label>Max price</label>
              <input type="range" min={0} max={priceMax || 100000} value={filters.priceMax || priceMax} onChange={(e) => setFilters((f) => ({ ...f, priceMax: Number(e.target.value) }))} />
              <div>{filters.priceMax ? `৳${filters.priceMax}` : 'Any'}</div>
            </div>
          </aside>

          <main className="selector-list">
            {loading ? <p>Loading…</p> : null}
            {filtered.map((it) => {
              const name = it.model || it.part_name || it.raw?.model || ''
              const price = it.price || it.raw?.price || ''
              const watt = it.watt || it.raw?.watt || it.wattage || it.raw?.wattage || 0
              const img = it.raw?.image_url || it.raw?.image || it.image || null
              const specs = it.raw || it.raw?.specs || {}
              const bench = it.benchmark_score || it.raw?.benchmark_score || ''
              const compatibilityBadge = getCompatibilityBadge(step, it, currentSelections)
              const stores = getStoreCoverage(it)
              const rowSpecs = getRowSpecs(step, it, watt, bench)
              return (
                <article key={it.id || it.part_id || name} className="selector-row">
                  <div className="selector-row-image">
                    {img ? <img src={img} alt={name} /> : <div className="selector-row-placeholder" />}
                  </div>

                  <div className="selector-row-center">
                    <div className="selector-row-headline">
                      <h4>{name}</h4>
                      <span className="selector-row-stock">{String(it.stock_status || it.raw?.stock_status || 'in stock').replace('_', ' ')}</span>
                    </div>
                    <div className="muted small">{it.brand || it.raw?.brand}</div>
                    <ul className="selector-row-specs">
                      {rowSpecs.map((spec) => <li key={spec}>{spec}</li>)}
                    </ul>
                    <div className="selector-row-badges">
                      {compatibilityBadge?.text ? <span className={`selector-inline-badge ${compatibilityBadge.tone}`}>{compatibilityBadge.text}</span> : null}
                      {stores.map((store) => (
                        <span key={store.name} className={`selector-inline-store ${store.tone}`}>{store.name}</span>
                      ))}
                    </div>
                  </div>

                  <div className="selector-row-right">
                    <div className="selector-row-price">{price ? `৳${price}` : ''}</div>
                    <button type="button" onClick={() => { onSelect(it) }}>Add</button>
                  </div>
                </article>
              )
            })}
          </main>
        </div>
      </div>
    </section>
  )
}

export default ComponentSelector
