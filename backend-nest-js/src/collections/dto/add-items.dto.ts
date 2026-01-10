import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional } from 'class-validator';
export class AddItemsDto {
  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'Eklenecek film IDleri',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  movieIds?: number[];
  @ApiPropertyOptional({
    example: [1, 2],
    description: 'Eklenecek dizi IDleri',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  seriesIds?: number[];
}