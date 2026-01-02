import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'kullanici_adi',
    description: 'En az 3 karakterli kullanıcı adı',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'sifre123', description: 'En az 6 karakterli şifre' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // Rol bilgisini DTO'ya koymuyoruz.
  // Çünkü kullanıcı kayıt olurken "Ben Adminim" diyememeli.
  // Rol atamasını biz kodun içinde (Service'te) yapacağız.
}
