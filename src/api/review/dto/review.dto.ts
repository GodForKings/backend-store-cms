import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class ReviewDto {
  @IsString()
  @IsNotEmpty({ message: 'Текст обязателен' })
  text!: string;

  @IsNumber()
  @Min(1, { message: 'Мин - 1' })
  @Max(5, { message: 'Макс - 5' })
  @IsNotEmpty({ message: 'Оценка обязательна' })
  rating!: number;
}
