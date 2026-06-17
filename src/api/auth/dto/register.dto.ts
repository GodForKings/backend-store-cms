import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterRequest {
  @ApiProperty({
    description: 'Отображаемое имя',
    example: 'John Yik',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Имя должно быть строкой' })
  @MaxLength(50, { message: 'Имя не может быть больше 50 символов' })
  name?: string;

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
