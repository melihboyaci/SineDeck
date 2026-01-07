import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({
    example: 'Favori Filmlerim',
    description: 'Koleksiyon adı',
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    example: 'En sevdiğim filmler burada',
    description: 'Koleksiyon açıklaması',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
