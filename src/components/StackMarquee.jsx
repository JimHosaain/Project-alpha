const techStack = ['PCB', 'Star Tech', 'Ryans', 'UCC']

function StackMarquee() {
  const items = [...techStack, ...techStack]

  return (
    <section className="stack-section">
      <p className="stack-title">Integrated with trusted local retailers</p>

      <div className="marquee-track-wrap">
        <div className="marquee-track">
          {items.map((item, index) => (
            <div className="stack-pill" key={`${item}-${index}`}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StackMarquee
