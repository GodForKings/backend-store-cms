import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString({ message: 'Email Обязателен' })
  @IsEmail({}, { message: 'Некорректный формат почты' })
  email!: string;

  @MinLength(6, { message: 'Пароль должен содержать не менее 8-ми символов' })
  @MaxLength(24, { message: 'Не более 24 символов' })
  @IsString({ message: 'String для пароля' })
  password!: string;
}
