import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginRequest {
  @ApiProperty({ description: 'Email', example: 'example@gmail.com' })
  @IsNotEmpty({ message: 'Email обязателен' })
  @IsEmail({}, { message: 'Некорректный формат почты' })
  email!: string;

  @ApiProperty({
    description: 'Password',
    example: '12345678',
    minLength: 8,
    maxLength: 32,
  })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(8, { message: 'Пароль должен быть больше 8-ми символов' })
  @MaxLength(32, { message: 'Пароль не может быть больше 32-х символов' })
  password!: string;
}
