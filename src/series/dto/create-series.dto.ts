import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateSeriesDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  startYear: number;

  @IsInt()
  @IsOptional()
  endYear?: number;

  @IsOptional()
  @IsUrl()
  posterUrl?: string;
}
