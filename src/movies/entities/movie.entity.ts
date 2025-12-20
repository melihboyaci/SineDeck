import { Genre } from '../../genres/entities/genre.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
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

  @ManyToMany(() => Genre, (genre) => genre.movies, { cascade: false })
  @JoinTable()
  genres: Genre[];
}
