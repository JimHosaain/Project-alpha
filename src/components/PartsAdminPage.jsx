import { useEffect, useMemo, useState } from 'react'
import {
  createPart,
  createStore,
  createStoreAvailability,
  listParts,
  listStoreAvailability,
  listStores,
  updatePart,
} from '../api'

const categoryOptions = ['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'PSU', 'Case', 'Cooling']
const stockOptions = ['In Stock', 'Limited', 'Out of Stock']

const emptyPartForm = {
  category: 'CPU',
  part_name: '',
  brand: '',
  model: '',
  price: '',
  watt: '',
  stock_status: 'In Stock',
  specsText: '{\n  "notes": ""\n}',
}

const emptyStoreForm = {
  store_name: '',
  store_location: '',
}

const emptyAvailabilityForm = {
  store_id: '',
  part_id: '',
  stock_status: 'In Stock',
  price: '',
}

function parseSpecs(text) {
  if (!String(text || '').trim()) return {}
  return JSON.parse(text)
}

function safeSpecsText(value) {
  if (!value || typeof value !== 'object') return '{\n  "notes": ""\n}'
  return JSON.stringify(value, null, 2)
}

function PartsAdminPage({ onBack }) {
  const [parts, setParts] = useState([])
  const [stores, setStores] = useState([])
  const [availability, setAvailability] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [partForm, setPartForm] = useState(emptyPartForm)
  const [editingPartId, setEditingPartId] = useState(null)
  const [storeForm, setStoreForm] = useState(emptyStoreForm)
  const [availabilityForm, setAvailabilityForm] = useState(emptyAvailabilityForm)
  const [savingPart, setSavingPart] = useState(false)
  const [savingStore, setSavingStore] = useState(false)
  const [savingAvailability, setSavingAvailability] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [partsRows, storeRows, availabilityRows] = await Promise.all([
        listParts(),
        listStores(),
        listStoreAvailability(),
      ])
      setParts(partsRows)
      setStores(storeRows)
      setAvailability(availabilityRows)

      setAvailabilityForm((current) => ({
        ...current,
        store_id: current.store_id || String(storeRows[0]?.store_id || ''),
        part_id: current.part_id || String(partsRows[0]?.part_id || ''),
      }))
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const partPreview = useMemo(() => {
    return parts.slice(0, 8)
  }, [parts])

  const resetPartForm = () => {
    setEditingPartId(null)
    setPartForm(emptyPartForm)
  }

  const handlePartSubmit = async (event) => {
    event.preventDefault()
    setSavingPart(true)
    setError('')

    try {
      const payload = {
        category: partForm.category,
        part_name: partForm.part_name,
        brand: partForm.brand,
        model: partForm.model,
        price: Number(partForm.price),
        watt: Number(partForm.watt || 0),
        stock_status: partForm.stock_status,
        specs: parseSpecs(partForm.specsText),
      }

      if (!Number.isFinite(payload.price)) {
        throw new Error('Price must be a number')
      }

      if (editingPartId) {
        await updatePart(editingPartId, payload)
      } else {
        await createPart(payload)
      }

      await loadData()
      resetPartForm()
    } catch (err) {
      setError(err.message || 'Failed to save part')
    } finally {
      setSavingPart(false)
    }
  }

  const handleEditPart = (part) => {
    setEditingPartId(part.part_id)
    setPartForm({
      category: part.category,
      part_name: part.part_name,
      brand: part.brand || '',
      model: part.model || '',
      price: String(part.price),
      watt: String(part.watt ?? 0),
      stock_status: part.stock_status || 'In Stock',
      specsText: safeSpecsText(part.specs),
    })
  }

  const handleStoreSubmit = async (event) => {
    event.preventDefault()
    setSavingStore(true)
    setError('')

    try {
      await createStore(storeForm)
      setStoreForm(emptyStoreForm)
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to save store')
    } finally {
      setSavingStore(false)
    }
  }

  const handleAvailabilitySubmit = async (event) => {
    event.preventDefault()
    setSavingAvailability(true)
    setError('')

    try {
      const payload = {
        store_id: Number(availabilityForm.store_id),
        part_id: Number(availabilityForm.part_id),
        stock_status: availabilityForm.stock_status,
        price: Number(availabilityForm.price),
      }

      await createStoreAvailability(payload)
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to save store pricing')
    } finally {
      setSavingAvailability(false)
    }
  }

  return (
    <section className="parts-admin-page">
      <div className="parts-admin-head">
        <div>
          <p className="parts-admin-kicker">Database manager</p>
          <h2>Manage parts, stores, and pricing.</h2>
          <p>
            Add PC parts once, edit them in the browser, and map each part to retailer pricing.
          </p>
        </div>
        <button type="button" className="builder-back-btn" onClick={onBack}>
          Back home
        </button>
      </div>

      {error ? <div className="parts-admin-alert is-error">{error}</div> : null}
      {!loading && parts.length === 0 ? (
        <div className="parts-admin-alert">
          No parts yet. Use the form below to seed your first PC components.
        </div>
      ) : null}

      <div className="parts-admin-grid">
        <form className="parts-admin-panel" onSubmit={handlePartSubmit}>
          <div className="parts-admin-panel-head">
            <h3>{editingPartId ? 'Edit part' : 'Add a new part'}</h3>
            {editingPartId ? (
              <button type="button" className="plain-pill-btn" onClick={resetPartForm}>
                Cancel edit
              </button>
            ) : null}
          </div>

          <div className="parts-admin-fields">
            <label>
              Category
              <select name="category" value={partForm.category} onChange={(e) => setPartForm((c) => ({ ...c, category: e.target.value }))}>
                {categoryOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Part name
              <input
                type="text"
                value={partForm.part_name}
                onChange={(e) => setPartForm((c) => ({ ...c, part_name: e.target.value }))}
                placeholder="Ryzen 7 7700X"
                required
              />
            </label>

            <label>
              Brand
              <input
                type="text"
                value={partForm.brand}
                onChange={(e) => setPartForm((c) => ({ ...c, brand: e.target.value }))}
                placeholder="AMD"
              />
            </label>

            <label>
              Model
              <input
                type="text"
                value={partForm.model}
                onChange={(e) => setPartForm((c) => ({ ...c, model: e.target.value }))}
                placeholder="7700X"
              />
            </label>

            <label>
              Price
              <input
                type="number"
                min="0"
                value={partForm.price}
                onChange={(e) => setPartForm((c) => ({ ...c, price: e.target.value }))}
                placeholder="31500"
                required
              />
            </label>

            <label>
              Watt
              <input
                type="number"
                min="0"
                value={partForm.watt}
                onChange={(e) => setPartForm((c) => ({ ...c, watt: e.target.value }))}
                placeholder="105"
              />
            </label>

            <label>
              Stock status
              <select
                value={partForm.stock_status}
                onChange={(e) => setPartForm((c) => ({ ...c, stock_status: e.target.value }))}
              >
                {stockOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="parts-admin-textarea">
            Specs JSON
            <textarea
              rows="6"
              value={partForm.specsText}
              onChange={(e) => setPartForm((c) => ({ ...c, specsText: e.target.value }))}
              placeholder='{"cores": 8, "threads": 16, "socket": "AM5"}'
            />
          </label>

          <button type="submit" className="glow-pill-btn full-width" disabled={savingPart}>
            {savingPart ? 'Saving part...' : editingPartId ? 'Update part' : 'Save part'}
          </button>
        </form>

        <div className="parts-admin-panel parts-admin-side">
          <div className="parts-admin-panel-head">
            <h3>Part catalog</h3>
            <span className="parts-admin-count">{parts.length} items</span>
          </div>

          <div className="parts-admin-list">
            {partPreview.map((part) => (
              <article className="parts-admin-item" key={part.part_id}>
                <div>
                  <p>{part.category}</p>
                  <strong>{part.part_name}</strong>
                  <span>
                    {part.brand || 'Unknown brand'} · {part.model || 'No model'}
                  </span>
                </div>
                <div className="parts-admin-item-meta">
                  <span>৳{Number(part.price).toLocaleString('en-US')}</span>
                  <span>{part.stock_status}</span>
                  <button type="button" className="plain-pill-btn" onClick={() => handleEditPart(part)}>
                    Edit
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="parts-admin-grid three-col">
        <form className="parts-admin-panel" onSubmit={handleStoreSubmit}>
          <div className="parts-admin-panel-head">
            <h3>Add a store</h3>
          </div>

          <div className="parts-admin-fields single-col">
            <label>
              Store name
              <input
                type="text"
                value={storeForm.store_name}
                onChange={(e) => setStoreForm((c) => ({ ...c, store_name: e.target.value }))}
                placeholder="Star Tech"
                required
              />
            </label>
            <label>
              Location
              <input
                type="text"
                value={storeForm.store_location}
                onChange={(e) => setStoreForm((c) => ({ ...c, store_location: e.target.value }))}
                placeholder="Dhaka"
              />
            </label>
          </div>

          <button type="submit" className="glow-pill-btn full-width" disabled={savingStore}>
            {savingStore ? 'Saving store...' : 'Save store'}
          </button>
        </form>

        <form className="parts-admin-panel" onSubmit={handleAvailabilitySubmit}>
          <div className="parts-admin-panel-head">
            <h3>Store pricing</h3>
          </div>

          <div className="parts-admin-fields single-col">
            <label>
              Store
              <select
                value={availabilityForm.store_id}
                onChange={(e) => setAvailabilityForm((c) => ({ ...c, store_id: e.target.value }))}
                required
              >
                <option value="">Select store</option>
                {stores.map((store) => (
                  <option key={store.store_id} value={store.store_id}>
                    {store.store_name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Part
              <select
                value={availabilityForm.part_id}
                onChange={(e) => setAvailabilityForm((c) => ({ ...c, part_id: e.target.value }))}
                required
              >
                <option value="">Select part</option>
                {parts.map((part) => (
                  <option key={part.part_id} value={part.part_id}>
                    {part.part_name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Stock status
              <select
                value={availabilityForm.stock_status}
                onChange={(e) => setAvailabilityForm((c) => ({ ...c, stock_status: e.target.value }))}
              >
                {stockOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Price
              <input
                type="number"
                min="0"
                value={availabilityForm.price}
                onChange={(e) => setAvailabilityForm((c) => ({ ...c, price: e.target.value }))}
                placeholder="35000"
                required
              />
            </label>
          </div>

          <button type="submit" className="glow-pill-btn full-width" disabled={savingAvailability}>
            {savingAvailability ? 'Saving pricing...' : 'Save pricing'}
          </button>
        </form>

        <div className="parts-admin-panel parts-admin-side">
          <div className="parts-admin-panel-head">
            <h3>Retail pricing entries</h3>
            <span className="parts-admin-count">{availability.length} rows</span>
          </div>

          <div className="parts-admin-list">
            {availability.slice(0, 8).map((row) => (
              <article className="parts-admin-item" key={row.availability_id}>
                <div>
                  <p>{row.store_name}</p>
                  <strong>{row.part_name}</strong>
                  <span>
                    {row.category} · {row.store_location || 'No location'}
                  </span>
                </div>
                <div className="parts-admin-item-meta">
                  <span>৳{Number(row.price).toLocaleString('en-US')}</span>
                  <span>{row.stock_status}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {loading ? <div className="parts-admin-alert">Loading catalog...</div> : null}
    </section>
  )
}

export default PartsAdminPage
