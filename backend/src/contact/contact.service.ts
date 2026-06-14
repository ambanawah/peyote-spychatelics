import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async getSettings() {
    let settings = await this.prisma.contactSettings.findFirst();
    if (!settings) {
      settings = await this.prisma.contactSettings.create({
        data: { whatsappNumber: '+13202626158', email: 'carlloy57@gmail.com' },
      });
    }
    return settings;
  }

  async updateSettings(data: any) {
    const settings = await this.getSettings();
    return this.prisma.contactSettings.update({ where: { id: settings.id }, data });
  }

  async sendInquiry(dto: { name: string; email: string; subject: string; message: string }) {
    console.log('Inquiry received:', dto);
    return { message: 'Inquiry sent successfully' };
  }
}
