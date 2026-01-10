import { Season } from '../../seasons/entities/season.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('episodes')
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  episodeNumber: number;
  @Column({ type: 'text', nullable: true })
  description?: string;
  @Column()
  duration: number; 
  @ManyToOne(() => Season, (season) => season.episodes, { onDelete: 'CASCADE' })
  season: Season;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}