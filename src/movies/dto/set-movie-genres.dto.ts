import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class SetMovieGenresDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt( { each: true } ) //her bir elemanın number (integer) olduğunu doğrular
  genreIds: number[]; //bunu yapmamızın sebebi frontendden sadece idleri alacağız
}
