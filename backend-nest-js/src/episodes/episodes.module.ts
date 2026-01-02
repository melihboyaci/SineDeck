import { Module } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodesController } from './episodes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './entities/episode.entity';
import { Season } from 'src/seasons/entities/season.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Episode, Season])],
  controllers: [EpisodesController],
  providers: [EpisodesService],
})
export class EpisodesModule {}
