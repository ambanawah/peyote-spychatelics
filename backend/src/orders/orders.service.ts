import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  private async sendOrderEmail(order: any) {
    try {
      const resend = new Resend(this.config.get('RESEND_API_KEY'));

      const itemsList = order.items.map((item: any) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.product?.name || 'Product'}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${item.price}</td>
        </tr>`
      ).join('');

      await resend.emails.send({
        from: 'Peyote Spychatelics <onboarding@resend.dev>',
        to: this.config.get('SMTP_USER') || 'ambanawah.carlos@ictuniversity.edu.cm',
        subject: `🌵 New Order ${order.orderNumber} — $${order.total}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:8px;overflow:hidden">
            <div style="background:#1A2E1A;padding:2rem;text-align:center">
              <h1 style="color:#C9A84C;margin:0;font-size:1.5rem">Peyote Spychatelics</h1>
              <p style="color:rgba(247,242,232,.7);margin:.5rem 0 0">New Order Received!</p>
            </div>
            <div style="padding:2rem">
              <h2 style="color:#1A2E1A;margin-top:0">Order ${order.orderNumber}</h2>
              <p><strong>Customer:</strong> ${order.user?.name} (${order.user?.email})</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>

              <h3 style="color:#1A2E1A;border-bottom:2px solid #C9A84C;padding-bottom:.5rem">Items Ordered</h3>
              <table style="width:100%;border-collapse:collapse">
                <thead>
                  <tr style="background:#1A2E1A;color:#F7F2E8">
                    <th style="padding:8px;text-align:left">Product</th>
                    <th style="padding:8px;text-align:center">Qty</th>
                    <th style="padding:8px;text-align:right">Price</th>
                  </tr>
                </thead>
                <tbody>${itemsList}</tbody>
              </table>

              <div style="margin-top:1rem;text-align:right">
                <p style="margin:.25rem 0;color:#666">Subtotal: $${order.subtotal}</p>
                <p style="margin:.25rem 0;color:#666">Shipping: $${order.shipping}</p>
                <p style="margin:.5rem 0;font-size:1.2rem;font-weight:bold;color:#1A2E1A">Total: $${order.total}</p>
              </div>

              <h3 style="color:#1A2E1A;border-bottom:2px solid #C9A84C;padding-bottom:.5rem">Shipping Address</h3>
              <p style="margin:.25rem 0">${order.shippingAddress?.name}</p>
              <p style="margin:.25rem 0">${order.shippingAddress?.street}</p>
              <p style="margin:.25rem 0">${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.zip}</p>
              <p style="margin:.25rem 0">${order.shippingAddress?.country}</p>

              <div style="margin-top:2rem;background:#f9f9f9;padding:1rem;border-radius:4px;text-align:center">
                <p style="margin:0;color:#666;font-size:.9rem">Contact the customer at:</p>
                <p style="margin:.5rem 0;font-weight:bold">${order.user?.email}</p>
              </div>
            </div>
          </div>
        `,
      });
      console.log(`✅ Order email sent for ${order.orderNumber}`);
    } catch (err) {
      console.error('❌ Failed to send order email:', err);
    }
  }

  async create(dto: any) {
    const orderNumber = `PS-${Date.now().toString().slice(-6)}`;
    const items = dto.items as Array<{productId:string; quantity:number; price:number}>;
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal > 150 ? 0 : 15;

    const order = await this.prisma.order.create({
      data: {
        orderNumber, userId: dto.userId,
        subtotal, shipping, total: subtotal + shipping,
        items: { create: items.map(i => ({ productId:i.productId, quantity:i.quantity, price:i.price })) },
        shippingAddress: { create: dto.shippingAddress },
      },
      include: {
        items: { include: { product: true } },
        shippingAddress: true,
        user: true,
      },
    });

    await this.sendOrderEmail(order);
    return order;
  }

  async findAll(page = 1, status?: string) {
    const skip = (page - 1) * 20;
    const where = status ? { status: status as any } : {};
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where, skip, take: 20,
        include: { user: { select: { name:true, email:true } }, items: { include: { product: true } }, shippingAddress: true },
        orderBy: { createdAt:'desc' }
      }),
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
