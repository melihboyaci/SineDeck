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
  //movieReposunu enjekte ettik bu sayede veritabanı işlemlerini yapabiliriz
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>, //private: başka yerden erişilemesin diye, readonly: sadece constructor içinde atanabilir, sonrasında değiştirilemez

    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    //neden async: çünkü veritabanı işlemleri asenkron işlemlerdir.
    const movie = this.movieRepo.create(createMovieDto); //create entitiy nesnesi üretir, save DB'ye insert/update yapar.
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
    //where işlemi yapar
    //return this.movieRepo.findOne({where:{id}}); //aynı işi yapar
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.findOne(id); //yoksa NotFoundException fırlatır

    Object.assign(movie, updateMovieDto); //sadece alanları yazar
    return this.movieRepo.save(movie); //güncellenmiş movie nesnesini DB'ye kaydeder
  }

  async remove(id: number) {
    const movie = await this.findOne(id); //yoksa NotFoundException fırlatır
    await this.movieRepo.delete(id); //delete vs remove:
    return { deleted: true, id }; //silindi bilgisi döner
  }

  async setGenres(movideId: number, dto: SetMovieGenresDto) {
    const movie = await this.movieRepo.findOne({
      where: { id: movideId },
      relations: { genres: true }, //SQL'deki karşılığı: LEFT JOIN, eğer bunu yapmazsak movie.genres undefined olur

      //Özetle: relations: { genres: true } ifadesi, "Bana filmi getirirken, o filme yapıştırılmış olan türlerin listesini de paket halinde getir" demektir.
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
