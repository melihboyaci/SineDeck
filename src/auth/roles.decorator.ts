import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/user.entity';

export const ROLES_KEY = 'roles';
// Artık parametre olarak rastgele string değil, UserRole istiyoruz
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
// metadata, kodun üzerine gizli bilgi ekler