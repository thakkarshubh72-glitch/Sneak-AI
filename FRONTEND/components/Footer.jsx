import Link from 'next/link';

export default function Footer() {
  const footerLinks = {
    Shop: [
      { label: 'New Arrivals', href: '/sneakers?filter=new' },
      { label: 'Trending', href: '/sneakers?filter=trending' },
      { label: 'All Sneakers', href: '/sneakers' },
      { label: 'AI Recommendations', href: '/recommend' },
    ],
    Brands: [
      { label: 'Nike', href: '/sneakers?brand=Nike' },
      { label: 'Adidas', href: '/sneakers?brand=Adidas' },
      { label: 'New Balance', href: '/sneakers?brand=New Balance' },
      { label: 'All Brands', href: '/sneakers' },
    ],
    Company: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Press', href: '#' },
    ],
    Support: [
      { label: 'Help Center', href: '#' },
      { label: 'Shipping', href: '#' },
      { label: 'Returns', href: '#' },
      { label: 'Size Guide', href: '#' },
    ],
  };

  return (
    <footer className="relative mt-32 border-t border-white/5 bg-dark-900/50 backdrop-blur-3xl overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 18L7 12L2 6" />
                  <path d="M7 18L22 12L7 6" />
                </svg>
              </div>
              <span className="font-display font-bold text-lg">SneakAI</span>
            </Link>
            <p className="text-sm text-dark-200 leading-relaxed">
              AI-powered sneaker discovery. Find your perfect pair with intelligent recommendations.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm text-white mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-dark-200 hover:text-white transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Signup */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <h4 className="font-semibold text-sm text-white mb-4">Stay in the Loop</h4>
            <p className="text-sm text-dark-200 mb-4">
              Get updates on new drops, exclusive collaborations, and AI features.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input-field !py-2.5 !text-sm flex-1"
                required
              />
              <button type="submit" className="btn-primary !py-2.5 !px-4 text-sm whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dark-300">
            © 2026 SneakAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-dark-300 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-xs text-dark-300 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-xs text-dark-300 hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
