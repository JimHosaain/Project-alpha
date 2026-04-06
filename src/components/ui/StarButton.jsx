function StarButton({ children, onClick, className = '', type = 'button' }) {
  return (
    <button type={type} className={`star-btn ${className}`.trim()} onClick={onClick}>
      <span className="star-btn-orbit" aria-hidden="true" />
      <span className="star-btn-bg" aria-hidden="true" />
      <span className="star-btn-label">{children}</span>
    </button>
  )
}

export default StarButton
