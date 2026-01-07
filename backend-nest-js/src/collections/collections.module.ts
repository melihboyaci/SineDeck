import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { Collection } from './entities/collection.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Series } from '../series/entities/series.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, Movie, Series])],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
