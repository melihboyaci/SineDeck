import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Repository } from 'typeorm';
@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    const exists = await this.genreRepo.findOne({
      where: { name: createGenreDto.name },
    });

    if (exists) {
      throw new ConflictException('Genre already exists');
    }

    const genre = this.genreRepo.create(createGenreDto);
    return this.genreRepo.save(genre);
  }

  findAll() {
    return this.genreRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number) {
    const genre = await this.genreRepo.findOneBy({ id });
    if (!genre) {
      throw new NotFoundException(`Genre ${id} not found`);
    }
    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.findOne(id);
    Object.assign(genre, updateGenreDto);
    return this.genreRepo.save(genre);
  }

  async remove(id: number) {
    const genre = this.findOne(id);
    await this.genreRepo.delete(id);
    return { deleted: true, id };
  }
}
