'use client';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCart } from '@/store/slices/cartSlice';
import { selectCartCount } from '@/store/slices/cartSlice';
import { selectCurrentUser, logout } from '@/store/slices/authSlice';
import { ShoppingCart, Search, Heart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const user = useSelector(selectCurrentUser);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-forest sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-gold font-bold text-xl tracking-wide">
          Peyote <span className="text-cream font-normal">Spychatelics</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex gap-8 items-center">
          {[['/', 'Home'], ['/shop', 'Shop'], ['/contact', 'Contact']].map(([href, label]) => (
            <Link key={href} href={href}
              className="text-cream/70 hover:text-gold text-sm transition-colors border-b border-transparent hover:border-gold pb-0.5">
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href="/shop" className="nav-icon-btn hidden md:flex">
            <Search size={18} />
          </Link>
          <button className="nav-icon-btn hidden md:flex">
            <Heart size={18} />
          </button>
          <button onClick={() => dispatch(toggleCart())}
            className="nav-icon-btn relative">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-forest text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          {user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="nav-icon-btn">
                <User size={18} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-100 rounded shadow-lg py-1 z-50">
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-mist" onClick={() => setMenuOpen(false)}>
                      <LayoutDashboard size={14} /> Admin Dashboard
                    </Link>
                  )}
                  <Link href="/account" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-mist" onClick={() => setMenuOpen(false)}>
                    <User size={14} /> My Account
                  </Link>
                  <button onClick={() => { dispatch(logout()); setMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-mist w-full text-left text-red-600">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="bg-gold/10 border border-gold/30 text-gold text-xs font-medium px-3 py-1.5 rounded-sm hover:bg-gold hover:text-forest transition-all">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
