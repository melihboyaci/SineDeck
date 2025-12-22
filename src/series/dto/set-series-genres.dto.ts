import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class SetSeriesGenresDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  genreIds: number[];
}
