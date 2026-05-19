import { useEffect, useState } from 'react'
import { listBuilds } from '../api'

function MyBuildsPage({ onBack, onLoadBuild }) {
  const [builds, setBuilds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    listBuilds()
      .then((rows) => {
        if (!active) return
        setBuilds(rows || [])
      })
      .catch(() => setBuilds([]))
      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="my-builds-page">
      <div className="page-head">
        <button type="button" onClick={onBack}>Back</button>
        <h2>My Builds</h2>
      </div>

      {loading ? <p>Loading…</p> : null}

      <div className="builds-list">
        {builds.map((b) => (
          <article key={b.id || b.build_id} className="build-item">
            <div>
              <strong>{b.name || b.title || `Build ${b.id || b.build_id}`}</strong>
              <div className="muted">Price: ৳{b.total_price}</div>
            </div>
            <div className="build-actions">
              <button type="button" onClick={() => onLoadBuild && onLoadBuild(b)}>Load</button>
              <a href={`#/builds/${b.id || b.build_id}`} target="_blank" rel="noreferrer">View</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MyBuildsPage
