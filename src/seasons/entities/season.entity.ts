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

  // onDelete: 'CASCADE' -> Eğer Dizi silinirse, bu sezon da veritabanından silinsin.
  @ManyToOne(() => Series, (series) => series.seasons, { onDelete: 'CASCADE' })
  series: Series; //[] kullanmadık çünkü bir sezon sadece bir diziye ait olabilir

  // cascade: true -> Sezon kaydedildiğinde veya güncellendiğinde, içindeki bölümler de otomatik olarak kaydedilir/güncellenir.
  @OneToMany(() => Episode, (episode) => episode.season, { cascade: true })
  episodes: Episode[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
