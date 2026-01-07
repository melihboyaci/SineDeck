import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async onModuleInit() {
    const adminExists = await this.userRepo.findOne({
      where: { role: UserRole.ADMIN },
    });
    if (!adminExists) {
      console.log('Admin bulunamadı. Otomatik oluşturuluyor...');
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('123456', salt);

      const admin = await this.userRepo.create({
        username: 'admin',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      await this.userRepo.save(admin);
      console.log(
        '✅ Varsayılan Admin Oluşturuldu! (Kullanıcı: admin, Şifre: 123456)',
      );
    } else {
      console.log('Admin zaten var.');
    }
  }

  findAll() {
    return this.userRepo.find();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    const user = await this.findOne(id);

    user.role = updateRoleDto.role;

    return await this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    this.userRepo.remove(user);

    return { deleted: true, id };
  }
}
