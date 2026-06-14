// src/auth/dto/reset-password.dto.ts
import { IsString, MinLength, Matches } from 'class-validator';
export class ResetPasswordDto {
  @IsString() token: string;
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: 'Password too weak' })
  password: string;
}
