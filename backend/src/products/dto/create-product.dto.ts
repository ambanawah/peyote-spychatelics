// src/products/dto/create-product.dto.ts
import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsObject, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '@prisma/client';

export class CreateProductDto {
  @IsString() name: string;
  @IsOptional() @IsString() scientificName?: string;
  @IsString() description: string;
  @Type(() => Number) @IsNumber() @Min(0) price: number;
  @IsOptional() @Type(() => Number) @IsNumber() comparePrice?: number;
  @Type(() => Number) @IsNumber() @Min(0) stock: number;
  @IsString() categoryId: string;
  @IsOptional() @IsString() sku?: string;
  @IsOptional() @IsString() origin?: string;
  @IsOptional() @IsEnum(ProductStatus) status?: ProductStatus;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsObject() specifications?: Record<string, any>;
  @IsOptional() @IsArray() images?: { url: string; publicId: string; alt?: string; isPrimary?: boolean }[];
}
