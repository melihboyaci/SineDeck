import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from './entities/episode.entity';
import { Repository } from 'typeorm';
import { Season } from 'src/seasons/entities/season.entity';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(Episode)
    private readonly episodeRepo: Repository<Episode>,

    @InjectRepository(Season)
    private readonly seasonRepo: Repository<Season>,
  ) {}

  async create(createEpisodeDto: CreateEpisodeDto) {
    //sezon var mı? dtodaki seasonId'yi bunun için sakladık
    const season = await this.seasonRepo.findOne({
      where: { id: createEpisodeDto.seasonId },
    });

    if (!season) {
      throw new NotFoundException(
        `Season ${createEpisodeDto.seasonId} not found`,
      );
    }

    const newEpisode = this.episodeRepo.create({
      ...createEpisodeDto,
      season: season,
    });

    return await 'This action adds a new episode';
  }

  async findAll() {
    return await this.episodeRepo.find({
      relations: ['seasons'], //hangi sezona ait?
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} episode`;
  }

  update(id: number, updateEpisodeDto: UpdateEpisodeDto) {
    return `This action updates a #${id} episode`;
  }

  remove(id: number) {
    return `This action removes a #${id} episode`;
  }
}
