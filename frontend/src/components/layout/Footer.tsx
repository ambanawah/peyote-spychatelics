import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-forest text-cream/60 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="font-serif text-gold text-xl font-bold mb-3">Peyote Spychatelics</div>
          <p className="leading-relaxed text-xs">Premium botanical specimens for collectors and enthusiasts worldwide.</p>
          <div className="mt-4 flex gap-3">
            <a href="https://wa.me/13202626158" target="_blank" rel="noreferrer"
              className="bg-[#25D366]/20 text-[#25D366] px-3 py-1 text-xs rounded-sm hover:bg-[#25D366]/30 transition-colors">
              WhatsApp
            </a>
            <a href="mailto:carlloy57@gmail.com"
              className="bg-gold/10 text-gold px-3 py-1 text-xs rounded-sm hover:bg-gold/20 transition-colors">
              Email
            </a>
          </div>
        </div>
        <div>
          <div className="text-cream font-semibold text-xs tracking-widest uppercase mb-4">Shop</div>
          {['All Plants', 'Cacti & Succulents', 'Medicinal Herbs', 'Tropical Rarities', 'Fungi'].map(l => (
            <Link key={l} href="/shop" className="block mb-2 hover:text-gold transition-colors text-xs">{l}</Link>
          ))}
        </div>
        <div>
          <div className="text-cream font-semibold text-xs tracking-widest uppercase mb-4">Account</div>
          {[['My Account', '/account'], ['Order History', '/account/orders'], ['Wishlist', '/wishlist'], ['Login', '/auth/login']].map(([l, h]) => (
            <Link key={h} href={h} className="block mb-2 hover:text-gold transition-colors text-xs">{l}</Link>
          ))}
        </div>
        <div>
          <div className="text-cream font-semibold text-xs tracking-widest uppercase mb-4">Contact</div>
          <p className="text-xs mb-2">📱 +1 (320) 262-6158</p>
          <p className="text-xs mb-2">✉️ carlloy57@gmail.com</p>
          <p className="text-xs mt-4 leading-relaxed">Mon–Sat: 9am–6pm CST<br />WhatsApp support 24/7</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} Peyote Spychatelics. All rights reserved.
      </div>
    </footer>
  );
}
