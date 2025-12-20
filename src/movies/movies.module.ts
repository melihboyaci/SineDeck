import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Genre } from 'src/genres/entities/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Genre])], //ne yapar: repo olarak kullanabilmemizi sağlar
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
