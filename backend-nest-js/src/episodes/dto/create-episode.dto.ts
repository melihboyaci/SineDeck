import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateEpisodeDto {
  @ApiProperty({ example: 'Pilot', description: 'Bölüm başlığı' })
  @IsString()
  @IsNotEmpty()
  title: string;
  @ApiProperty({ example: 1, description: 'Bölüm numarası' })
  @IsInt()
  @IsNotEmpty()
  episodeNumber: number;
  @ApiPropertyOptional({
    example: 'İlk bölüm açıklaması...',
    description: 'Bölüm açıklaması',
  })
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty({ example: 45, description: 'Bölüm süresi (dakika)' })
  @IsInt()
  @IsNotEmpty()
  duration: number;
  @ApiProperty({ example: 1, description: 'Bağlı olduğu sezon ID' })
  @IsInt()
  @IsNotEmpty()
  seasonId: number;
}