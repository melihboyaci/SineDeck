import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { Series } from './entities/series.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from 'src/genres/entities/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Series, Genre])],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
