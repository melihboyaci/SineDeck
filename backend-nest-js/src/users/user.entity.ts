import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// Rollerin tanımlandığı yer
export enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    USER = 'user'
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true}) //aynı kullanıcı adı ile 2. kişi kayıt olamasın
    username: string;

    @Column()
    password: string;

    @Column({
        type: 'simple-enum',
        enum: UserRole,
        default: UserRole.USER
    }) //rol yoksa default user
    role: UserRole;

}