import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MoviesService {
  //movieReposunu enjekte ettik bu sayede veritabanı işlemlerini yapabiliriz
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>, //private: başka yerden erişilemesin diye, readonly: sadece constructor içinde atanabilir, sonrasında değiştirilemez
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    //neden async: çünkü veritabanı işlemleri asenkron işlemlerdir.
    const movie = this.movieRepo.create(createMovieDto); //create entitiy nesnesi üretir, save DB'ye insert/update yapar.
    return this.movieRepo.save(movie);
  }

  findAll() {
    return this.movieRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
