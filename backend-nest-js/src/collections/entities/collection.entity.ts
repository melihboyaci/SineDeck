import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { Series } from '../../series/entities/series.entity';
@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToMany(() => Movie, { eager: true })
  @JoinTable({
    name: 'collection_movies',
    joinColumn: { name: 'collectionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'movieId', referencedColumnName: 'id' },
  })
  movies: Movie[];

  @ManyToMany(() => Series, { eager: true })
  @JoinTable({
    name: 'collection_series',
    joinColumn: { name: 'collectionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'seriesId', referencedColumnName: 'id' },
  })
  series: Series[];

  @CreateDateColumn()
  createdAt: Date;
}
