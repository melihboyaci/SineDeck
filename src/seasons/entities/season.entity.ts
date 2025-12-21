import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('seasons')
export class Season {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seasonNumber: number;

  @Column({ nullable: true })
  description?: string;


  @ManyToOne(() =>)
}
