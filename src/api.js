const API_BASE = import.meta.env.VITE_API_BASE || ''

async function readJsonResponse(res) {
  const payload = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(payload.error || 'Request failed')
  }
  return payload
}

export async function signUpUser(user) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
  return readJsonResponse(res)
}

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  return readJsonResponse(res)
}

export async function listParts(category) {
  const suffix = category ? `?category=${encodeURIComponent(category)}` : ''
  const res = await fetch(`${API_BASE}/api/parts${suffix}`)
  const rows = await readJsonResponse(res)
  // normalize to frontend expected shape
  return rows.map((r) => ({
    part_id: r.part_id || r.id,
    category: r.category,
    part_name: r.part_name || r.model || r.part_name,
    brand: r.brand,
    model: r.model,
    price: r.price,
    watt: r.watt,
    stock_status: r.stock_status,
    specs: r.specs || r.specs_json || null,
  }))
}

export async function createPart(part) {
  const res = await fetch(`${API_BASE}/api/parts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(part),
  })
  return readJsonResponse(res)
}

export async function updatePart(partId, part) {
  const res = await fetch(`${API_BASE}/api/parts/${partId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(part),
  })
  return readJsonResponse(res)
}

export async function listStores() {
  const res = await fetch(`${API_BASE}/api/stores`)
  return readJsonResponse(res)
}

export async function createStore(store) {
  const res = await fetch(`${API_BASE}/api/stores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(store),
  })
  return readJsonResponse(res)
}

export async function listStoreAvailability() {
  const res = await fetch(`${API_BASE}/api/store-availability`)
  return readJsonResponse(res)
}

export async function createStoreAvailability(entry) {
  const res = await fetch(`${API_BASE}/api/store-availability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
  return readJsonResponse(res)
}

export async function saveBuild(build) {
  const res = await fetch(`${API_BASE}/api/builds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(build),
  })
  return readJsonResponse(res)
}

export async function listBuilds() {
  const res = await fetch(`${API_BASE}/api/builds`)
  if (!res.ok) throw new Error('Failed to list builds')
  return res.json()
}

export async function getSmartRecommendations(payload) {
  const res = await fetch(`${API_BASE}/smart/builder/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return readJsonResponse(res)
}

export async function getSmartStepOptions(step, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  )
  const suffix = query.toString() ? `?${query.toString()}` : ''
  const res = await fetch(`${API_BASE}/smart/builder/options/${encodeURIComponent(step)}${suffix}`)
  return readJsonResponse(res)
}

export async function runCompatibilityCheck(payload) {
  const res = await fetch(`${API_BASE}/smart/builder/compatibility-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return readJsonResponse(res)
}
