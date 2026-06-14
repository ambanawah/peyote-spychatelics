import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard, AdminGuard)
export class CustomersController {
  constructor(private customers: CustomersService) {}
  @Get() findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.customers.findAll(+page||1, +limit||20);
  }
  @Get(':id') findOne(@Param('id') id: string) { return this.customers.findOne(id); }
  @Patch(':id/suspend') suspend(@Param('id') id: string) { return this.customers.suspend(id); }
  @Patch(':id/activate') activate(@Param('id') id: string) { return this.customers.activate(id); }
}
