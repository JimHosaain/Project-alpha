import MotionFooter from './ui/motion-footer'
import { ChevronDown, PlusIcon } from 'lucide-react'

const buildStats = [
  { value: '50,000+', label: 'Builds Created' },
  { value: '12,000+', label: 'Active Users' },
  { value: '2,500+', label: 'Components Listed' },
  { value: '15+', label: 'Partner Stores' },
]

const processSteps = [
  {
    step: '01',
    title: 'Save Your Budget',
    description: 'Tell us your range so we can tailor suggestions that stay realistic and optimized.',
  },
  {
    step: '02',
    title: 'Choose Use Case',
    description: 'Gaming, work, editing, or daily use. We shape the build around the task.',
  },
  {
    step: '03',
    title: 'Set Priorities',
    description: 'Pick performance, silence, aesthetics, or value to guide component selection.',
  },
  {
    step: '04',
    title: 'Check Availability',
    description: 'Compare options from local shops and find the parts that are actually in stock.',
  },
]

const curatedBuilds = [
  {
    title: '1440p Gaming Beast',
    price: '78,500',
    tag: 'Best value',
    specs: ['RTX 4070 Super', 'Ryzen 5 7600X', '32GB DDR5', '1TB NVMe'],
  },
  {
    title: 'Budget 1080p Build',
    price: '52,000',
    tag: 'Smart pick',
    specs: ['RX 7600', 'Core i5-12400F', '16GB DDR4', '500GB SSD'],
  },
  {
    title: '1440p Creator Rig',
    price: '1,25,000',
    tag: 'Creator',
    specs: ['RTX 4080', 'Ryzen 9 7900', '64GB DDR5', '2TB NVMe'],
  },
]

const benchmarkBars = [
  { label: 'RTX 3050', value: 42 },
  { label: 'RTX 4060', value: 58 },
  { label: 'RTX 4070', value: 74 },
  { label: 'RX 6600', value: 65 },
]

const faqItems = [
  {
    question: 'What is PC Builder?',
    answer: 'PC Builder helps you pick compatible parts, compare prices, and plan complete builds faster.',
  },
  {
    question: 'Which components can I compare?',
    answer: 'You can compare CPUs, GPUs, memory, storage, power supplies, and cases with practical benchmarks.',
  },
  {
    question: 'Does it check compatibility automatically?',
    answer: 'Yes. Core fit checks are applied while selecting parts so common issues are highlighted early.',
  },
  {
    question: 'Can I save and share my build?',
    answer: 'Saved builds can be revisited later and shared with friends for review before purchase.',
  },
  {
    question: 'Do prices come from local retailers?',
    answer: 'Yes. The platform is focused on local availability so you can compare realistic in-stock options.',
  },
]

const latestPosts = [
  {
    title: 'Why DDR5 Matters in 2026',
    category: 'Guide',
    description: 'Understand latency, bandwidth, and where DDR5 actually improves day-to-day performance.',
  },
  {
    title: 'Best Coolers for Quiet Builds',
    category: 'Parts',
    description: 'A short list of cooling options that keep thermals stable without adding extra noise.',
  },
  {
    title: 'How to Balance GPU and CPU',
    category: 'Advice',
    description: 'Avoid common bottlenecks with practical pairing tips for gaming and creator workflows.',
  },
  {
    title: 'Choosing the Right PSU Wattage',
    category: 'Safety',
    description: 'Pick reliable headroom for future upgrades while staying within efficient power ranges.',
  },
]

function HomeShowcaseSections({ onBenchmarkCompare }) {
  return (
    <div className="home-showcase">
      <section className="home-stats">
        {buildStats.map((item) => (
          <article className="stat-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="home-section home-step-section">
        <div className="framed-section">
          <span className="framed-corner framed-corner-tl" aria-hidden="true" />
          <span className="framed-corner framed-corner-tr" aria-hidden="true" />
          <span className="framed-corner framed-corner-bl" aria-hidden="true" />
          <span className="framed-corner framed-corner-br" aria-hidden="true" />

          <div className="home-section-head center framed-header">
            <p className="eyebrow">PC Building Made Simple</p>
            <h2>PC Building Made Simple</h2>
            <p>
              Four clear steps to help you save time, control cost, and build with confidence.
            </p>
          </div>

          <div className="step-grid framed-grid">
            {processSteps.map((step) => (
              <article className="step-card" key={step.step}>
                <span className="step-number">{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head between">
          <div>
            <p className="eyebrow">Featured Picks</p>
            <h2>Curated by Our Experts</h2>
          </div>
          <a href="#" className="section-link">
            View all
          </a>
        </div>

        <div className="build-grid">
          {curatedBuilds.map((build) => (
            <article className="build-card curated-cta-card" key={build.title}>
              <PlusIcon className="curated-cta-plus curated-cta-plus-tl" strokeWidth={1} aria-hidden="true" />
              <PlusIcon className="curated-cta-plus curated-cta-plus-tr" strokeWidth={1} aria-hidden="true" />
              <PlusIcon className="curated-cta-plus curated-cta-plus-bl" strokeWidth={1} aria-hidden="true" />
              <PlusIcon className="curated-cta-plus curated-cta-plus-br" strokeWidth={1} aria-hidden="true" />

              <div className="curated-cta-rail curated-cta-rail-left" aria-hidden="true" />
              <div className="curated-cta-rail curated-cta-rail-right" aria-hidden="true" />
              <div className="curated-cta-divider" aria-hidden="true" />

              <div className="curated-cta-content">
                <div className="build-card-top">
                  <div>
                    <p className="build-tag">{build.tag}</p>
                    <h3>{build.title}</h3>
                  </div>
                  <span className="build-price">{build.price}</span>
                </div>

                <ul className="spec-list">
                  {build.specs.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>

                <button type="button" className="build-btn">
                  View Build
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section faq-section">
        <div className="faq-shell">
          <p className="faq-kicker">FAQ</p>
          <h2>Frequently asked questions.</h2>

          <div className="faq-list" role="list">
            {faqItems.map((item) => (
              <details className="faq-item" key={item.question}>
                <summary>
                  <span>{item.question}</span>
                  <ChevronDown size={16} aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section benchmark-section">
        <div className="framed-section">
          <span className="framed-corner framed-corner-tl" aria-hidden="true" />
          <span className="framed-corner framed-corner-tr" aria-hidden="true" />
          <span className="framed-corner framed-corner-bl" aria-hidden="true" />
          <span className="framed-corner framed-corner-br" aria-hidden="true" />

          <div className="home-section-head center framed-header">
            <p className="eyebrow">Benchmark Showcase</p>
            <h2>RTX 3050 vs RX 6600</h2>
            <p>Pick the right card by comparing common options on a single clean chart.</p>
          </div>

          <div className="benchmark-grid framed-grid">
            <div className="chart-card benchmark-framed-card">
              <span className="framed-corner framed-corner-tl" aria-hidden="true" />
              <span className="framed-corner framed-corner-tr" aria-hidden="true" />
              <span className="framed-corner framed-corner-bl" aria-hidden="true" />
              <span className="framed-corner framed-corner-br" aria-hidden="true" />

              {benchmarkBars.map((bar) => (
                <div className="chart-row" key={bar.label}>
                  <span>{bar.label}</span>
                  <div className="chart-track">
                    <div className="chart-fill" style={{ width: `${bar.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="benchmark-list benchmark-framed-card">
              <span className="framed-corner framed-corner-tl" aria-hidden="true" />
              <span className="framed-corner framed-corner-tr" aria-hidden="true" />
              <span className="framed-corner framed-corner-bl" aria-hidden="true" />
              <span className="framed-corner framed-corner-br" aria-hidden="true" />

              {benchmarkBars.map((bar) => (
                <div className="benchmark-item" key={bar.label}>
                  <span>{bar.label}</span>
                  <strong>{bar.value}/100</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="benchmark-actions framed-grid">
            <button type="button" className="build-btn benchmark-compare-btn" onClick={onBenchmarkCompare}>
              Compare With Other Components
            </button>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head between">
          <div>
            <p className="eyebrow">Latest Bits</p>
            <h2>Stay Updated</h2>
          </div>
          <a href="#" className="section-link">
            Explore
          </a>
        </div>

        <div className="news-grid">
          {latestPosts.map((post) => (
            <article className="news-card" key={post.title}>
              <span className="news-corner-plus news-corner-plus-tl" aria-hidden="true" />
              <span className="news-corner-plus news-corner-plus-tr" aria-hidden="true" />
              <span className="news-corner-plus news-corner-plus-bl" aria-hidden="true" />
              <span className="news-corner-plus news-corner-plus-br" aria-hidden="true" />
              <div className="news-content">
                <span>{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <MotionFooter />
    </div>
  )
}

export default HomeShowcaseSections
