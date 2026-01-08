import { Genre } from '../../genres/entities/genre.entity';
import { Season } from '../../seasons/entities/season.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('series') //ne işe yarar: Bu dekoratör, Series sınıfını bir veritabanı tablosu olarak tanımlar ve tablo adını 'series' olarak belirler.
export class Series {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  startYear: number;

  @Column({ nullable: true })
  endYear?: number;

  @Column({ nullable: true })
  creator?: string;

  @Column({ nullable: true })
  posterUrl?: string;

  @OneToMany(() => Season, (season) => season.series, { cascade: true })
  seasons: Season[];

  //(genre) => genre.series bize çift yönlülük sağladı dolayısıyla 'relations' kullanabilmemizi yani türden de bir diziye erişebilmemizi.
  @ManyToMany(() => Genre, (genre) => genre.series, { cascade: false })
  @JoinTable()
  genres: Genre[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
