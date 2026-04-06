import { ArrowLeft, ArrowRight, Briefcase, Gamepad2, LayoutPanelTop, Check } from 'lucide-react'
import { useState } from 'react'

const options = [
  {
    id: 'gaming',
    title: 'Pure Gaming',
    description: 'High FPS, ray tracing, and minimal latency for competitive and AAA titles.',
    Icon: Gamepad2,
  },
  {
    id: 'workstation',
    title: 'Workstation',
    description: 'Multi-threaded performance for 3D rendering, video editing, and compiling.',
    Icon: Briefcase,
  },
  {
    id: 'daily',
    title: 'Daily Drive',
    description: 'Silent operation, sleek aesthetics, and power efficiency for everyday use.',
    Icon: LayoutPanelTop,
  },
]

function BuildFlowStep({ onBack }) {
  const [selected, setSelected] = useState('workstation')
  const selectedItem = options.find((item) => item.id === selected)

  return (
    <section className="builder-flow">
      <div className="builder-progress-head">
        <p className="builder-step-label">STEP 02 OF 04</p>
        <p className="builder-step-title">Use Case Selection</p>
      </div>

      <div className="builder-progress-track" aria-hidden="true">
        <span style={{ width: '50%' }} />
      </div>

      <div className="builder-copy">
        <h2>What&apos;s your primary craft?</h2>
        <p>
          We&apos;ll optimize your component selection based on the performance requirements of your
          specific workload.
        </p>
      </div>

      <div className="builder-cards">
        {options.map((option) => {
          const IconComponent = option.Icon

          return (
            <button
              key={option.id}
              type="button"
              className={`builder-card ${selected === option.id ? 'is-selected' : ''}`}
              onClick={() => setSelected(option.id)}
            >
              <div className="builder-card-icon-wrap">
                <IconComponent size={18} />
              </div>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
              {selected === option.id ? (
                <span className="builder-check" aria-hidden="true">
                  <Check size={12} />
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="builder-footer">
        <button type="button" className="builder-back-btn" onClick={onBack}>
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="builder-next-wrap">
          <p>CURRENT SELECTION</p>
          <strong>{selectedItem?.title ?? 'Workstation'}</strong>
          <button type="button" className="builder-next-btn">
            Next Step
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default BuildFlowStep
