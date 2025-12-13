import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])], //ne yapar: Movie entity'sini modüle dahil eder, eğer yapmasaydık MoviesService içinde Movie repository'sine erişemezdik
  
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
