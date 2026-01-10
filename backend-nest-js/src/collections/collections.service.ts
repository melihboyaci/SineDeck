import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { AddItemsDto } from './dto/add-items.dto';
import { Movie } from '../movies/entities/movie.entity';
import { Series } from '../series/entities/series.entity';
@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepo: Repository<Collection>,
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Series)
    private readonly seriesRepo: Repository<Series>,
  ) {}

  async create(userId: number, dto: CreateCollectionDto) {
    const collection = this.collectionRepo.create({
      ...dto,
      userId,
      movies: [],
      series: [],
    });
    return this.collectionRepo.save(collection);
  }

  async findAllByUser(userId: number) {
    return this.collectionRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number) {
    const collection = await this.collectionRepo.findOne({
      where: { id },
      relations: ['movies', 'series', 'movies.genres', 'series.genres'],
    });

    if (!collection) {
      throw new NotFoundException('Koleksiyon bulunamadı');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException('Bu koleksiyona erişim yetkiniz yok');
    }

    return collection;
  }

  async update(id: number, userId: number, dto: UpdateCollectionDto) {
    const collection = await this.findOne(id, userId);
    Object.assign(collection, dto);
    return this.collectionRepo.save(collection);
  }

  async remove(id: number, userId: number) {
    const collection = await this.findOne(id, userId);
    await this.collectionRepo.remove(collection);
    return { message: 'Koleksiyon silindi' };
  }

  async addItems(id: number, userId: number, dto: AddItemsDto) {
    const collection = await this.findOne(id, userId);

    if (dto.movieIds && dto.movieIds.length > 0) {
      const movies = await this.movieRepo.find({
        where: { id: In(dto.movieIds) },
      });

      const existingIds = collection.movies.map((m) => m.id);
      const newMovies = movies.filter((m) => !existingIds.includes(m.id));
      collection.movies = [...collection.movies, ...newMovies];
    }

    if (dto.seriesIds && dto.seriesIds.length > 0) {
      const series = await this.seriesRepo.find({
        where: { id: In(dto.seriesIds) },
      });
      const existingIds = collection.series.map((s) => s.id);
      const newSeries = series.filter((s) => !existingIds.includes(s.id));
      collection.series = [...collection.series, ...newSeries];
    }

    return this.collectionRepo.save(collection);
  }

  async removeItems(id: number, userId: number, dto: AddItemsDto) {
    const collection = await this.findOne(id, userId);

    if (dto.movieIds && dto.movieIds.length > 0) {
      const movieIds = dto.movieIds;
      collection.movies = collection.movies.filter(
        (m) => !movieIds.includes(m.id),
      );
    }

    if (dto.seriesIds && dto.seriesIds.length > 0) {
      const seriesIds = dto.seriesIds;
      collection.series = collection.series.filter(
        (s) => !seriesIds.includes(s.id),
      );
    }

    return this.collectionRepo.save(collection);
  }
}
