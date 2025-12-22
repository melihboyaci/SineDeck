import { Injectable } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Series } from './entities/series.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private readonly seriesRepo: Repository<Series>,
  ) {}

  async create(createSeriesDto: CreateSeriesDto) {
    const newSeries = this.seriesRepo.create(createSeriesDto);
    //create() nesneyi hazırlar, save() veritabanına yazar
    return await this.seriesRepo.save(newSeries);
  }

  async findAll() {
    return await this.seriesRepo.find({
      relations: ['seasons', 'genres'], 
      //diziyi çekerken sezonları ve türleri de getir
    });
  }

  async findOne(id: number) {
    return await this.seriesRepo.findOne({
      where: {id},
      relations: ['seasons', 'seasons.episodes']
      //detayda sezonları ve bölümleri getir
    });
  }

  update(id: number, updateSeriesDto: UpdateSeriesDto) {
    return `This action updates a #${id} series`;
  }

  remove(id: number) {
    return `This action removes a #${id} series`;
  }
}
