import Link from 'next/link';
import { Hero } from '@/components/shop/Hero';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { CategoryGrid } from '@/components/shop/CategoryGrid';
import { Testimonials } from '@/components/shop/Testimonials';
import { Newsletter } from '@/components/shop/Newsletter';
import { productsApi } from '@/lib/api';

async function getFeaturedProducts() {
  try {
    const res = await productsApi.getAll({ status: 'FEATURED', limit: 4 });
    return res.data.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      <Hero />
      <CategoryGrid />
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-baseline justify-between mb-10">
          <div>
            <div className="section-eyebrow">Curated Collection</div>
            <h2 className="section-title">Featured Specimens</h2>
          </div>
          <Link href="/shop" className="text-gold text-sm font-medium border-b border-gold/30 hover:border-gold transition-colors">
            View all →
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>
      <Testimonials />
      <Newsletter />
    </>
  );
}
