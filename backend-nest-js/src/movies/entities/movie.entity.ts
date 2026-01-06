import { Genre } from '../../genres/entities/genre.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  director: string;

  @Column()
  releaseYear: number;

  @Column({ nullable: true })
  posterUrl?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToMany(() => Genre, (genre) => genre.movies, { cascade: false })
  @JoinTable()
  genres: Genre[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
