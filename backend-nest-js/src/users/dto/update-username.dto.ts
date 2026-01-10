import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUsernameDto {
  @ApiProperty({
    example: 'yeniKullaniciAdi',
    description: 'Yeni kullanıcı adı',
  })
  @IsNotEmpty({ message: 'Kullanıcı adı boş olamaz' })
  @IsString()
  @MinLength(3, { message: 'Kullanıcı adı en az 3 karakter olmalıdır' })
  username: string;
}
