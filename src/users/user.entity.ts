import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true}) //aynı kullanıcı adı ile 2. kişi kayıt olamasın
    username: string;

    @Column()
    password: string;

    @Column({default: 'user'}) //rol yoksa default user
    role: string;

}