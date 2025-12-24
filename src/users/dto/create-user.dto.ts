import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // Rol bilgisini DTO'ya koymuyoruz.
  // Çünkü kullanıcı kayıt olurken "Ben Adminim" diyememeli.
  // Rol atamasını biz kodun içinde (Service'te) yapacağız.
}
