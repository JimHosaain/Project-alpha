const techStack = [
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Star_Tech_Ltd._Logo_Original_%28Color%29_01.png',
    alt: 'Star Tech',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Official_Logo_of_Ryans_Computers_Limited.png',
    alt: 'Ryans',
  },
  {
    src: 'https://cdn.brandfetch.io/idsD6rDhqk/w/300/h/126/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1771741285845',
    alt: 'UCC',
  },
  {
    src: 'https://cdn.brandfetch.io/idUKvPaOxp/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1772630185399',
    alt: 'PCB',
  },
]

function StackMarquee() {
  const items = [...techStack, ...techStack]

  return (
    <section className="stack-section">
      <p className="stack-title">Integrated with trusted local retailers</p>

      <div className="marquee-track-wrap">
        <div className="marquee-track">
          {items.map((item, index) => (
            <div className="stack-pill" key={`${item.alt}-${index}`}>
              <img className="stack-logo" src={item.src} alt={item.alt} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StackMarquee
