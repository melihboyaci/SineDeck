import { Module } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { SeasonsController } from './seasons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Season } from './entities/season.entity';
import { Series } from 'src/series/entities/series.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Season, Series])],
  controllers: [SeasonsController],
  providers: [SeasonsService],
})
export class SeasonsModule {}