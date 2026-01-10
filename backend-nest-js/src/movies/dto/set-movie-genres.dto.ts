import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';
export class SetMovieGenresDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Filme atanacak tür ID listesi',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true }) 
  genreIds: number[]; 
}