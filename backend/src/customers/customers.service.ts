import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [customers, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: 'CUSTOMER' }, skip, take: limit,
        select: { id:true, email:true, name:true, isActive:true, createdAt:true, _count: { select: { orders:true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
    ]);
    return { data: customers, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const customer = await this.prisma.user.findUnique({
      where: { id },
      include: { orders: { include: { items: { include: { product: true } } }, orderBy: { createdAt:'desc' } }, addresses: true },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    const { password, ...safe } = customer as any;
    return safe;
  }

  async suspend(id: string) {
    return this.prisma.user.update({ where: { id }, data: { isActive: false } });
  }

  async activate(id: string) {
    return this.prisma.user.update({ where: { id }, data: { isActive: true } });
  }
}
