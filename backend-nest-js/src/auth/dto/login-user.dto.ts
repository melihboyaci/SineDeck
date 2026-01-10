import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class LoginUserDto {
  @ApiProperty({
    example: 'kullanici_adi',
    description: 'Kullanıcının giriş için kullandığı kullanıcı adı',
  })
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty({ example: 'sifre123', description: 'En az 6 haneli şifre' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}