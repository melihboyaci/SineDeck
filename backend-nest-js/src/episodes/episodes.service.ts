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
    return await this.episodeRepo.save(newEpisode);
  }

  async findAll() {
    return await this.episodeRepo.find({
      relations: ['season'],
    });
  }

  async findOne(id: number) {
    const episode = await this.episodeRepo.findOne({
      where: { id },
      relations: ['season', 'season.series'],
    });

    if (!episode) {
      throw new NotFoundException(`Episode #${id} not found`);
    }

    return episode;
  }

  async update(id: number, updateEpisodeDto: UpdateEpisodeDto) {
    const episode = await this.findOne(id);
    Object.assign(episode, updateEpisodeDto);
    return this.episodeRepo.save(episode);
  }

  async remove(id: number) {
    const episode = this.findOne(id);
    await this.episodeRepo.delete(id);
    return { deleted: true, id };
  }
}
