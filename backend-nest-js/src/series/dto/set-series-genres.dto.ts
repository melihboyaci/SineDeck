import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class SetSeriesGenresDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Diziye atanacak tür ID listesi',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  genreIds: number[];
}
