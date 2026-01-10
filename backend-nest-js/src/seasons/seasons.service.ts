import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Season } from './entities/season.entity';
import { Repository } from 'typeorm';
import { Series } from 'src/series/entities/series.entity';
@Injectable()
export class SeasonsService {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepo: Repository<Season>,
    @InjectRepository(Series)
    private readonly seriesRepo: Repository<Series>,
  ) {}

  async create(createSeasonDto: CreateSeasonDto) {
    const series = await this.seriesRepo.findOneBy({
      id: createSeasonDto.seriesId,
    });

    if (!series) {
      throw new NotFoundException(
        `Series ${createSeasonDto.seriesId} not found`,
      );
    }

    const newSeason = this.seasonRepo.create({
      ...createSeasonDto,
      series: series,
    });
    return await this.seasonRepo.save(newSeason);
  }

  async findAll() {
    return await this.seasonRepo.find({
      relations: ['series', 'episodes'],
    });
  }

  async findOne(id: number) {
    const season = await this.seasonRepo.findOne({
      where: { id },
      relations: ['series', 'episodes'],
    });

    if (!season) {
      throw new NotFoundException(`Season #${id} not found`);
    }

    return season;
  }

  async update(id: number, updateSeasonDto: UpdateSeasonDto) {
    const season = await this.findOne(id);
    Object.assign(season, updateSeasonDto);
    return this.seasonRepo.save(season);
  }

  async remove(id: number) {
    const season = this.findOne(id);
    await this.seasonRepo.delete(id);
    return { deleted: true, id };
  }
}
