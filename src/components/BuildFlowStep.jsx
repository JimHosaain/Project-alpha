import { ArrowLeft, ArrowRight, Briefcase, Gamepad2, LayoutPanelTop, Check, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const useCaseOptions = [
  {
    id: 'gaming',
    title: 'Gaming',
    description: 'High FPS, smooth thermals, and strong GPU focus.',
    Icon: Gamepad2,
  },
  {
    id: 'workstation',
    title: 'Workstation',
    description: 'Balanced performance for creator and productivity workloads.',
    Icon: Briefcase,
  },
  {
    id: 'daily',
    title: 'Daily Use',
    description: 'Quiet, efficient, and practical for everyday use.',
    Icon: LayoutPanelTop,
  },
]

const budgetPresets = [45000, 65000, 85000, 120000]

const buildCards = [
  {
    id: 'elite-alpha',
    title: 'Elite Alpha',
    purpose: 'Best for balanced workstation use',
    score: 98,
    price: 84500,
    badge: 'Best Value',
    tone: 'performance',
    specs: ['RTX 4070 Super', 'Ryzen 5 7600X', '32GB DDR5', '1TB NVMe'],
  },
  {
    id: 'nexus-stream',
    title: 'Nexus Stream',
    purpose: 'Great for creator and gaming balance',
    score: 84,
    price: 76500,
    badge: 'Recommended',
    tone: 'balanced',
    specs: ['RX 7800 XT', 'Ryzen 7 7700X', '32GB DDR5', '1TB NVMe'],
  },
  {
    id: 'swift-core',
    title: 'Swift Core',
    purpose: 'Efficient pick for practical everyday builds',
    score: 62,
    price: 62400,
    badge: 'Value',
    tone: 'value',
    specs: ['RX 7600', 'Core i5-12400F', '16GB DDR4', '500GB SSD'],
  },
]

const moneyFormatter = new Intl.NumberFormat('en-US')

function formatMoney(value) {
  return `৳${moneyFormatter.format(value)}`
}

function getRecommendedBuildId(useCase, budget) {
  if (budget >= 100000 || useCase === 'workstation') return 'elite-alpha'
  if (budget >= 70000 || useCase === 'gaming') return 'nexus-stream'
  return 'swift-core'
}

function BuildFlowStep({ onBack, onOpenManualBuilder }) {
  const [selectedUseCase, setSelectedUseCase] = useState(null)
  const [budget, setBudget] = useState(85000)
  const [manualBudget, setManualBudget] = useState('85000')
  const [stage, setStage] = useState('useCase')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalClosing, setIsModalClosing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedBuild, setSelectedBuild] = useState('nexus-stream')

  const recommendedBuildId = useMemo(
    () => getRecommendedBuildId(selectedUseCase, budget),
    [selectedUseCase, budget]
  )

  useEffect(() => {
    const openTimer = window.setTimeout(() => setIsModalOpen(true), 20)
    return () => window.clearTimeout(openTimer)
  }, [])

  useEffect(() => {
    if (!isModalClosing) return undefined

    const closeTimer = window.setTimeout(() => {
      setIsModalOpen(false)
      setShowResults(true)
    }, 230)

    return () => window.clearTimeout(closeTimer)
  }, [isModalClosing])

  const budgetPercent = useMemo(() => {
    const min = 35000
    const max = 180000
    return ((budget - min) / (max - min)) * 100
  }, [budget])

  const handleBudgetChange = (event) => {
    const nextBudget = Number(event.target.value)
    setBudget(nextBudget)
    setManualBudget(String(nextBudget))
  }

  const handleManualBudgetChange = (event) => {
    const sanitized = event.target.value.replace(/[^\d]/g, '')
    setManualBudget(sanitized)

    if (!sanitized) return

    const nextBudget = Number(sanitized)
    if (Number.isFinite(nextBudget)) {
      setBudget(Math.min(180000, Math.max(35000, nextBudget)))
    }
  }

  const applyManualBudget = () => {
    const nextBudget = Number(manualBudget)
    if (!Number.isFinite(nextBudget)) return

    const clampedBudget = Math.min(180000, Math.max(35000, nextBudget))
    setBudget(clampedBudget)
    setManualBudget(String(clampedBudget))
  }

  const closeModal = () => {
    setIsModalClosing(true)
  }

  const handleStartWithBuild = (buildId) => {
    setSelectedBuild(buildId)
    if (onOpenManualBuilder) {
      onOpenManualBuilder({ presetId: buildId, budget, useCase: activeUseCase })
    }
  }

  const handleBuildManually = () => {
    if (onOpenManualBuilder) {
      onOpenManualBuilder({ presetId: 'manual', budget, useCase: activeUseCase })
    }
  }

  const activeUseCase = selectedUseCase ?? 'workstation'

  return (
    <section className="builder-page">
      <div className={`builder-results-shell ${showResults ? 'is-visible' : ''}`}>
        <div className="builder-results-head">
          <div>
            <p className="builder-kicker">Recommended builds</p>
            <h2>Your guided results</h2>
            <p>Three clean builds matched to your selected use case and budget.</p>
          </div>
          <button type="button" className="builder-back-btn" onClick={onBack}>
            <ArrowLeft size={15} />
            Back home
          </button>
        </div>

        <div className="builder-results-grid">
          {buildCards.map((build) => {
            const isRecommended = build.id === recommendedBuildId
            const isSelected = selectedBuild === build.id

            return (
              <article
                key={build.id}
                className={`builder-result-card ${isRecommended ? 'is-recommended' : ''} ${isSelected ? 'is-selected' : ''}`}
              >
                <div className={`builder-result-visual ${build.tone}`}>
                  <span>{isRecommended ? 'Recommended' : build.badge}</span>
                </div>

                <div className="builder-result-toprow">
                  <p className="builder-result-label">{isRecommended ? 'Recommended' : build.badge}</p>
                  <strong>{formatMoney(build.price)}</strong>
                </div>

                <div className="builder-result-copy">
                  <h3>{build.title}</h3>
                  <p>{build.purpose}</p>
                </div>

                <ul className="builder-result-specs">
                  {build.specs.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>

                <div className="builder-result-footerline">
                  <span>Score {build.score}</span>
                  <strong>Est. {formatMoney(build.price)} BDT</strong>
                </div>

                <button type="button" className="builder-featured-btn" onClick={() => handleStartWithBuild(build.id)}>
                  Start with this build
                </button>
              </article>
            )
          })}
        </div>

        <div className="builder-manual-divider">
          <p>Don&apos;t want a recommendation?</p>
          <button type="button" className="builder-manual-btn" onClick={handleBuildManually}>
            Build Manually
          </button>
        </div>
      </div>

      {isModalOpen ? (
        <div className={`builder-modal-layer ${isModalClosing ? 'is-closing' : 'is-open'}`}>
          <button type="button" className="builder-modal-backdrop" aria-label="Close popup" onClick={closeModal} />

          <div className="builder-modal-card" role="dialog" aria-modal="true" aria-label="Guided build popup">
            <div className="builder-modal-header">
              <div>
                <p className="builder-kicker">PC Builder</p>
                <h2>Set your budget first</h2>
                <p>We&apos;ll recommend balanced builds and keep each part aligned with your limit.</p>
              </div>
              <div className="builder-modal-step">
                <Sparkles size={14} />
                <span>{stage === 'useCase' ? 'Step 1 of 2' : 'Step 2 of 2'}</span>
              </div>
            </div>

            <div className="builder-modal-body">
              <div className="builder-modal-section">
                <div className="builder-modal-section-head">
                  <span>Primary use case</span>
                </div>

                <div className="builder-usecase-grid">
                  {useCaseOptions.map((option) => {
                    const IconComponent = option.Icon
                    const active = selectedUseCase === option.id

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`builder-usecase-card ${active ? 'is-selected' : ''}`}
                        onClick={() => {
                          setSelectedUseCase(option.id)
                          setStage('budget')
                        }}
                      >
                        <div className="builder-usecase-icon">
                          <IconComponent size={18} />
                        </div>
                        <strong>{option.title}</strong>
                        <p>{option.description}</p>
                        {active ? <Check size={14} className="builder-selected-mark" aria-hidden="true" /> : null}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className={`builder-modal-section builder-budget-stage ${stage === 'budget' ? 'is-visible' : ''}`}>
                <div className="builder-modal-section-head between">
                  <span>Budget</span>
                  <strong>{formatMoney(budget)}</strong>
                </div>

                <div className="builder-budget-entry">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={manualBudget}
                    onChange={handleManualBudgetChange}
                    onFocus={() => setStage('budget')}
                    placeholder="Enter budget"
                  />
                  <button type="button" className="builder-apply-btn" onClick={applyManualBudget}>
                    Apply
                  </button>
                </div>

                <label className="builder-range-label" htmlFor="guided-budget-slider">
                  <span>Range</span>
                  <span>{formatMoney(budget)}</span>
                </label>

                <input
                  id="guided-budget-slider"
                  className="builder-range-slider"
                  type="range"
                  min="35000"
                  max="180000"
                  step="1000"
                  value={budget}
                  onChange={handleBudgetChange}
                  onMouseDown={() => setStage('budget')}
                  style={{ '--slider-fill': `${budgetPercent}%` }}
                />

                <div className="builder-preset-row">
                  {budgetPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`builder-preset-chip ${budget === preset ? 'is-active' : ''}`}
                      onClick={() => {
                        setBudget(preset)
                        setManualBudget(String(preset))
                        setStage('budget')
                      }}
                    >
                      {formatMoney(preset)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="builder-modal-footer">
              <div className="builder-modal-summary">
                  <span>Use case: {useCaseOptions.find((item) => item.id === activeUseCase)?.title}</span>
                <span>Budget: {formatMoney(budget)}</span>
                <span>Mode: Filter + Manual</span>
              </div>

                {stage === 'budget' ? (
                  <button type="button" className="builder-suggest-btn" onClick={closeModal}>
                    Suggest Builds
                    <ArrowRight size={15} />
                  </button>
                ) : (
                  <button type="button" className="builder-suggest-btn is-disabled" disabled>
                    Choose a use case
                  </button>
                )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default BuildFlowStep
