import { PartialType } from '@nestjs/swagger';
import { CreateMovieDto } from './create-movie.dto';

//PUT: Tüm alanlar zorunlu
//PATCH: Sadece güncellenen alanlar gönderilir, diğerleri zorunlu olmaz

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
