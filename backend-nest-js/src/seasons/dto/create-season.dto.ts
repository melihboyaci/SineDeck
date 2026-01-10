import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateSeasonDto {
  @ApiProperty({ example: 1, description: 'Sezon numarası' })
  @IsInt()
  @IsNotEmpty()
  seasonNumber: number;
  @ApiPropertyOptional({
    example: 'İlk sezon açıklaması...',
    description: 'Sezon açıklaması',
  })
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty({ example: 1, description: 'Bağlı olduğu dizi ID' })
  @IsInt()
  @IsNotEmpty()
  seriesId: number;
}