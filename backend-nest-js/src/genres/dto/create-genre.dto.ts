import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({ example: 'Aksiyon', description: 'Tür adı (1-50 karakter)' })
  @IsString()
  @Length(1, 50)
  name: string;
}
