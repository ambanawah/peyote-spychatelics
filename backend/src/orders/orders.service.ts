import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    const orderNumber = `PS-${Date.now().toString().slice(-6)}`;
    const items = dto.items as Array<{productId:string; quantity:number; price:number}>;
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal > 150 ? 0 : 15;
    return this.prisma.order.create({
      data: {
        orderNumber, userId: dto.userId,
        subtotal, shipping, total: subtotal + shipping,
        items: { create: items.map(i => ({ productId:i.productId, quantity:i.quantity, price:i.price })) },
        shippingAddress: { create: dto.shippingAddress },
      },
      include: { items: { include: { product: true } }, shippingAddress: true },
    });
  }

  async findAll(page = 1, status?: string) {
    const skip = (page - 1) * 20;
    const where = status ? { status: status as any } : {};
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({ where, skip, take: 20, include: { user: { select: { name:true, email:true } }, items: true }, orderBy: { createdAt:'desc' } }),
      this.prisma.order.count({ where }),
    ]);
    return { data: orders, total, page, pages: Math.ceil(total / 20) };
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } }, shippingAddress: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async track(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: { shippingAddress:true } });
    if (!order) throw new NotFoundException('Order not found');
    return { orderNumber: order.orderNumber, status: order.status, trackingNumber: order.trackingNumber, updatedAt: order.updatedAt };
  }

  async updateStatus(id: string, status: string, trackingNumber?: string) {
    return this.prisma.order.update({
      where: { id }, data: { status: status as any, ...(trackingNumber && { trackingNumber }) },
    });
  }
}
