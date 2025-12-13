import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number) {
    const movie = await this.movieRepo.findOneBy({ id });

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
}
