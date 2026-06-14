'use client';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal, selectCartOpen, closeCart, updateQuantity, removeItem } from '@/store/slices/cartSlice';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function CartDrawer() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const isOpen = useSelector(selectCartOpen);
  const shipping = total > 150 ? 0 : 15;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => dispatch(closeCart())} />
      )}
      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="bg-forest text-cream px-5 py-4 flex justify-between items-center">
          <div className="font-serif font-bold text-lg">Your Cart ({items.length})</div>
          <button onClick={() => dispatch(closeCart())} className="text-cream/70 hover:text-gold">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400">
              <ShoppingBag size={48} className="mb-4 opacity-30" />
              <p className="font-serif text-lg text-zinc-600">Your cart is empty</p>
              <p className="text-sm mt-1">Discover our rare botanical collection</p>
              <Link href="/shop" onClick={() => dispatch(closeCart())}
                className="mt-6 btn-primary text-sm px-5 py-2">
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 p-3 border border-zinc-100 rounded">
                  <div className="w-16 h-16 bg-mist rounded flex items-center justify-center text-2xl flex-shrink-0">
                    🌵
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-forest truncate">{item.name}</p>
                    <p className="text-xs text-sage italic">{item.species}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                        className="w-6 h-6 border border-zinc-200 rounded-full flex items-center justify-center hover:border-forest transition-colors">
                        <Minus size={10} />
                      </button>
                      <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                        className="w-6 h-6 border border-zinc-200 rounded-full flex items-center justify-center hover:border-forest transition-colors">
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => dispatch(removeItem(item.id))} className="text-zinc-300 hover:text-red-500 transition-colors">
                      <X size={14} />
                    </button>
                    <span className="font-bold text-forest text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-100 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Shipping</span>
              <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
            </div>
            {total < 150 && (
              <p className="text-xs text-center text-sage">Add ${(150 - total).toFixed(2)} more for free shipping</p>
            )}
            <div className="flex justify-between font-bold text-forest border-t pt-2">
              <span>Total</span>
              <span>${(total + shipping).toFixed(2)}</span>
            </div>
            <Link href="/checkout" onClick={() => dispatch(closeCart())}
              className="block w-full text-center btn-primary py-3 font-serif text-base tracking-wide">
              Proceed to Checkout →
            </Link>
            <button onClick={() => dispatch(closeCart())}
              className="block w-full text-center text-xs text-zinc-400 hover:text-zinc-600">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
