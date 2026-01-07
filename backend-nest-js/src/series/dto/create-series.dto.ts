import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSeriesDto {
  @ApiProperty({ example: 'Breaking Bad', description: 'Dizi başlığı' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Kimya öğretmeninin hikayesi...',
    description: 'Dizi açıklaması',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 2008, description: 'Başlangıç yılı' })
  @IsInt()
  @IsNotEmpty()
  startYear: number;

  @ApiPropertyOptional({
    example: 2013,
    description: 'Bitiş yılı (devam ediyorsa boş)',
  })
  @IsInt()
  @IsOptional()
  endYear?: number;

  @ApiPropertyOptional({
    example: 'Vince Gilligan',
    description: 'Yapımcı/Yaratıcı',
  })
  @IsString()
  @IsOptional()
  creator?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/poster.jpg',
    description: 'Dizi afişi URL veya dosya yolu',
  })
  @IsOptional()
  @IsString()
  posterUrl?: string;
}
