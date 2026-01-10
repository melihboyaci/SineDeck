import { Episode } from 'src/episodes/entities/episode.entity';
import { Series } from 'src/series/entities/series.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('seasons')
export class Season {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  seasonNumber: number;
  @Column({ type: 'text', nullable: true })
  description?: string;
  @ManyToOne(() => Series, (series) => series.seasons, { onDelete: 'CASCADE' })
  series: Series; 
  @OneToMany(() => Episode, (episode) => episode.season, { cascade: true })
  episodes: Episode[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}