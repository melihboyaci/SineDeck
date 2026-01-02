import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../user.entity';

export class UpdateRoleDto {
  @ApiProperty({
    example: 'editor',
    description: 'Kullanıcı rolü (admin, editor, user)',
    enum: UserRole,
  })
  @IsNotEmpty()
  @IsEnum(UserRole, { message: 'Invalid role' })
  role: UserRole;
}
