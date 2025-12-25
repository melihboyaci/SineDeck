import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

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
