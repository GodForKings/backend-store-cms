import { Transform } from 'class-transformer';
import { ArrayMinSize, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class ProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Название обязательно' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Описание обязательно' })
  description!: string;

  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Transform(({ value }) => Number(value))
  price!: number;

  @IsString({ message: 'Ошибка типа', each: true })
  @ArrayMinSize(1, { message: 'Добавьте хотя бы 1 картинку' })
  images!: string[];

  @IsUUID('4', { message: 'Некорректный ID категории' })
  @IsNotEmpty({ message: 'ID категории не может быть пустым' })
  categoryId!: string;

  @IsUUID('4', { message: 'Некорректный ID категории' })
  @IsNotEmpty({ message: 'ID цвета не может быть пустым' })
  colorId!: string;
}
