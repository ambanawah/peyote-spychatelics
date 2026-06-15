import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductsService } from './products.service';
import { CloudinaryService } from '../cloudinary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private cloudinary: CloudinaryService,
  ) {}

  @Get() findAll(@Query() query: any) { return this.productsService.findAll(query); }
  @Get('featured') getFeatured() { return this.productsService.getFeatured(); }
  @Get('categories') getCategories() { return this.productsService.getCategories(); }
  @Get('search') search(@Query('q') q: string) { return this.productsService.search(q); }
  @Get(':slug') findOne(@Param('slug') slug: string) { return this.productsService.findOne(slug); }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FilesInterceptor('images', 5, { storage: memoryStorage() }))
  async create(@Body() body: any, @UploadedFiles() files: Express.Multer.File[] = []) {
    const images = files ? await Promise.all(files.map(f => this.cloudinary.uploadImage(f))) : [];
    return this.productsService.create(body, images);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FilesInterceptor('images', 5, { storage: memoryStorage() }))
  async update(@Param('id') id: string, @Body() body: any, @UploadedFiles() files: Express.Multer.File[] = []) {
    const images = files ? await Promise.all(files.map(f => this.cloudinary.uploadImage(f))) : [];
    return this.productsService.update(id, body, images);
  }

  @Delete(':id') @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) { return this.productsService.remove(id); }

  @Post(':id/images') @UseGuards(JwtAuthGuard, AdminGuard)
  addImages(@Param('id') id: string, @Body() body: any) { return this.productsService.addImages(id, body.images); }

  @Delete('images/:imageId') @UseGuards(JwtAuthGuard, AdminGuard)
  removeImage(@Param('imageId') imageId: string) { return this.productsService.removeImage(imageId); }
}
