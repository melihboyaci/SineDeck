import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from './user.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users (Kullanıcı Yönetimi)')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Tüm kullanıcıları listele (Sadece Admin)' })
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Belirli bir kullanıcıyı getir (Sadece Admin)' })
  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Kullanıcı rolünü güncelle (Sadece Admin)' })
  @Roles(UserRole.ADMIN)
  @Patch(':id/role')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.usersService.updateRole(id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Kullanıcı adını güncelle (Sadece Admin)' })
  @Roles(UserRole.ADMIN)
  @Patch(':id/username')
  updateUsername(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsernameDto: UpdateUsernameDto,
  ) {
    return this.usersService.updateUsername(id, updateUsernameDto);
  }

  @ApiOperation({ summary: 'Kullanıcıyı sil (Sadece Admin)' })
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
