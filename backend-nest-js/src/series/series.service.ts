import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Series } from './entities/series.entity';
import { In, Repository } from 'typeorm';
import { Genre } from 'src/genres/entities/genre.entity';
import { SetSeriesGenresDto } from './dto/set-series-genres.dto';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private readonly seriesRepo: Repository<Series>,

    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,
  ) {}

  async create(createSeriesDto: CreateSeriesDto) {
    const newSeries = this.seriesRepo.create(createSeriesDto);
    //create() nesneyi hazırlar, save() veritabanına yazar
    return await this.seriesRepo.save(newSeries);
  }

  async findAll() {
    return await this.seriesRepo.find({
      relations: ['seasons', 'seasons.episodes', 'genres'],
      //diziyi çekerken sezonları ve türleri de getir
    });
  }

  async findOne(id: number) {
    const series = await this.seriesRepo.findOne({
      where: { id },
      relations: ['seasons', 'seasons.episodes', 'genres'],
      //detayda sezonları, bölümleri ve türleri getir
    });
    if (!series) {
      throw new NotFoundException(`Series ${id} not found`);
    }
    return series;
  }

  async update(id: number, updateSeriesDto: UpdateSeriesDto) {
    const series = await this.findOne(id);
    Object.assign(series, updateSeriesDto);
    return this.seriesRepo.save(series);
  }

  async remove(id: number) {
    const series = await this.findOne(id);
    await this.seriesRepo.delete(id);
    return { deleted: true, id };
  }

  async setGenres(seriesId: number, dto: SetSeriesGenresDto) {
    const series = await this.seriesRepo.findOne({
      where: { id: seriesId },
      relations: { genres: true },
    });

    if (!series) {
      throw new NotFoundException(`Series ${seriesId} not found`);
    }

    const genres = await this.genreRepo.find({
      where: { id: In(dto.genreIds) },
    });

    if (genres.length !== dto.genreIds.length) {
      throw new BadRequestException('One or more GenreIds are invalid');
    }

    series.genres = genres;
    return this.seriesRepo.save(series);
  }
}
