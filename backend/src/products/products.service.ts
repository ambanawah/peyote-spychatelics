import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 12);
    const skip = (page - 1) * limit;
    const where: any = {};
    if (query.category) where.category = { slug: query.category };
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { species: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = +query.minPrice;
      if (query.maxPrice) where.price.lte = +query.maxPrice;
    }
    const orderBy: any = query.sort === 'price_asc' ? { price: 'asc' }
      : query.sort === 'price_desc' ? { price: 'desc' }
      : { createdAt: 'desc' };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({ where, skip, take: limit, orderBy, include: { images: { take: 1 }, category: true } }),
      this.prisma.product.count({ where }),
    ]);
    return { data: products, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { images: true, specs: true, category: true, reviews: { include: { user: { select: { name: true } } } } },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: any, images: any[] = []) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    return this.prisma.product.create({
      data: {
        name: dto.name, slug, species: dto.species || '',
        description: dto.description || '', price: +dto.price,
        stock: +(dto.stock || 0), status: dto.status || 'AVAILABLE',
        origin: dto.origin, categoryId: dto.categoryId,
        ...(images.length > 0 && {
          images: { create: images.map((img, i) => ({ url: img.url, publicId: img.publicId, isPrimary: i === 0 })) },
        }),
      },
      include: { images: true, category: true },
    });
  }

  async update(id: string, dto: any, images: any[] = []) {
    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.species && { species: dto.species }),
        ...(dto.description && { description: dto.description }),
        ...(dto.price && { price: +dto.price }),
        ...(dto.stock !== undefined && { stock: +dto.stock }),
        ...(dto.status && { status: dto.status }),
        ...(dto.origin && { origin: dto.origin }),
        ...(dto.categoryId && { categoryId: dto.categoryId }),
        ...(images.length > 0 && {
          images: { create: images.map((img, i) => ({ url: img.url, publicId: img.publicId, isPrimary: i === 0 })) },
        }),
      },
      include: { images: true, category: true },
    });
  }

  async remove(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted' };
  }

  async getCategories() {
    return this.prisma.category.findMany({ include: { _count: { select: { products: true } } } });
  }

  async getFeatured() {
    return this.prisma.product.findMany({
      where: { status: 'FEATURED' },
      include: { images: { take: 1 }, category: true },
      take: 8,
    });
  }

  async search(q: string) {
    return this.prisma.product.findMany({
      where: { OR: [{ name: { contains: q, mode: 'insensitive' } }, { species: { contains: q, mode: 'insensitive' } }] },
      include: { images: { take: 1 } },
      take: 10,
    });
  }

  async addImages(productId: string, images: any[]) {
    return this.prisma.productImage.createMany({
      data: images.map((img, i) => ({ productId, url: img.url, publicId: img.publicId, isPrimary: i === 0 })),
    });
  }

  async removeImage(imageId: string) {
    await this.prisma.productImage.delete({ where: { id: imageId } });
    return { message: 'Image removed' };
  }
}
