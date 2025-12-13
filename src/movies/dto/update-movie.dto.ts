import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';

//PUT: Tüm alanlar zorunlu
//PATCH: Sadece güncellenen alanlar gönderilir, diğerleri zorunlu olmaz

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
