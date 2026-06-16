import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  // Guest & logged-in users can place orders
  @Post() create(@Body() dto: any) { return this.orders.create(dto); }

  @Get('my') @UseGuards(JwtAuthGuard)
  myOrders(@Query('userId') userId: string) { return this.orders.findByUser(userId); }

  @Get(':id/track') track(@Param('id') id: string) { return this.orders.track(id); }

  @Get() @UseGuards(JwtAuthGuard, AdminGuard)
  findAll(@Query('page') page?: string, @Query('status') status?: string) {
    return this.orders.findAll(+page||1, status);
  }

  @Patch(':id/status') @UseGuards(JwtAuthGuard, AdminGuard)
  updateStatus(@Param('id') id: string, @Body() body: any) {
    return this.orders.updateStatus(id, body.status, body.trackingNumber);
  }
}
