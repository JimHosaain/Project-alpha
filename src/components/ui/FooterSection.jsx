import { FrameIcon, GlobeIcon, Link2Icon, MailIcon, MessageCircleIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

const footerLinks = [
  {
    label: 'Product',
    links: [
      { title: 'Features', href: '#features' },
      { title: 'Pricing', href: '#pricing' },
      { title: 'Testimonials', href: '#testimonials' },
      { title: 'Integration', href: '#' },
    ],
  },
  {
    label: 'Company',
    links: [
      { title: 'FAQs', href: '#' },
      { title: 'About Us', href: '#' },
      { title: 'Privacy Policy', href: '#' },
      { title: 'Terms of Services', href: '#' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { title: 'Blog', href: '#' },
      { title: 'Changelog', href: '#' },
      { title: 'Brand', href: '#' },
      { title: 'Help', href: '#' },
    ],
  },
  {
    label: 'Social Links',
    links: [
      { title: 'Community', href: '#', icon: MessageCircleIcon },
      { title: 'Newsletter', href: '#', icon: MailIcon },
      { title: 'Docs', href: '#', icon: GlobeIcon },
      { title: 'Contact', href: '#', icon: Link2Icon },
    ],
  },
]

function AnimatedContainer({ className = '', delay = 0.1, children }) {
  const shouldReduceMotion = useReducedMotion()
  const MotionDiv = motion.div

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <MotionDiv
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </MotionDiv>
  )
}

function FooterContent() {
  return (
    <>
      <div className="footer-modern-glow" aria-hidden="true" />

      <div className="footer-modern-grid">
        <AnimatedContainer className="footer-brand-col">
          <FrameIcon className="footer-logo" />
          <p className="footer-copy">© {new Date().getFullYear()} PCB by alpha. All rights reserved.</p>
        </AnimatedContainer>

        <div className="footer-modern-links-grid">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1} className="footer-link-col">
              <h4>{section.label}</h4>
              <ul>
                {section.links.map((link) => {
                  const Icon = link.icon
                  return (
                    <li key={link.title}>
                      <a href={link.href}>
                        {Icon ? <Icon className="footer-link-icon" /> : null}
                        {link.title}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </>
  )
}

function FooterSection({ as = 'footer', className = '' }) {
  const classes = `home-footer footer-modern ${className}`.trim()

  if (as === 'div') {
    return (
      <div className={classes}>
        <FooterContent />
      </div>
    )
  }

  return (
    <footer className={classes}>
      <FooterContent />
    </footer>
  )
}

export default FooterSection
