import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';
export class CreateMovieDto {
  @ApiProperty({
    example: 'Inception',
    description: 'Film başlığı (1-200 karakter)',
  })
  @IsString()
  @Length(1, 200)
  title: string;
  @ApiProperty({
    example: 'Christopher Nolan',
    description: 'Yönetmen adı (1-100 karakter)',
  })
  @IsString()
  @Length(1, 100)
  director: string;
  @ApiProperty({ example: 2010, description: 'Çıkış yılı (1888-2026)' })
  @IsInt()
  @Min(1888) 
  @Max(2026)
  releaseYear: number;
  @ApiPropertyOptional({
    example: 'https://example.com/poster.jpg',
    description: 'Film afişi URL veya dosya yolu',
  })
  @IsOptional()
  @IsString()
  posterUrl?: string;
  @ApiPropertyOptional({
    example: 'Film açıklaması...',
    description: 'Film özeti ve detayları',
  })
  @IsOptional()
  @IsString()
  description?: string;
}