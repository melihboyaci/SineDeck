import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from 'src/genres/entities/genre.entity';
import { SetMovieGenresDto } from './dto/set-movie-genres.dto';
import { Notification } from 'rxjs';
@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const movie = this.movieRepo.create(createMovieDto);
    return this.movieRepo.save(movie);
  }

  findAll() {
    return this.movieRepo.find({
      relations: { genres: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const movie = await this.movieRepo.findOne({
      where: { id },
      relations: { genres: true },
    });

    if (!movie) {
      throw new NotFoundException(`Movie ${id} not found`);
    }

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.findOne(id);
    Object.assign(movie, updateMovieDto);
    return this.movieRepo.save(movie);
  }

  async remove(id: number) {
    const movie = await this.findOne(id);
    await this.movieRepo.delete(id);
    return { deleted: true, id };
  }

  async setGenres(movideId: number, dto: SetMovieGenresDto) {
    const movie = await this.movieRepo.findOne({
      where: { id: movideId },
      relations: { genres: true },
    });

    if (!movie) {
      throw new NotFoundException(`Movie ${movideId} not found`);
    }

    const genres = await this.genreRepo.find({
      where: { id: In(dto.genreIds) },
    });

    if (genres.length !== dto.genreIds.length) {
      throw new BadRequestException('One or more GenreIds are invalid');
    }

    movie.genres = genres;
    return this.movieRepo.save(movie);
  }
}
