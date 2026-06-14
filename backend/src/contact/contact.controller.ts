import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('contact')
export class ContactController {
  constructor(private contact: ContactService) {}
  @Get('settings') getSettings() { return this.contact.getSettings(); }
  @Put('settings') @UseGuards(JwtAuthGuard, AdminGuard) updateSettings(@Body() body: any) { return this.contact.updateSettings(body); }
  @Post('inquiry') sendInquiry(@Body() body: any) { return this.contact.sendInquiry(body); }
}
