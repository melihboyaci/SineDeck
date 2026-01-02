import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Kullanıcı doğrulama, arka planda çalışır
  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.userRepo.findOne({
      where: { username: loginUserDto.username },
    });

    // kullanıcı adı varsa VE şifresi doğruysa (bcrypt ile kontrol et)
    // compare() de asenkron
    if (user && (await bcrypt.compare(loginUserDto.password, user.password))) {
      return user;
    }
    return null;
  }

  // giriş yapma (token üretme)
  async login(user: User) {
    //token içine gizlenecek bilgiler
    const payload = { username: user.username, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload), // şifreli token üretilir
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  // kayıt olma
  async register(createUserDto: CreateUserDto) {
    // şifreyi hash'le (10 turda)
    // hocada hashSync yani asenkron kullanmadığı için şifreleme bitene kadar bekleyecek
    // biz asenkron kullanıyoruz, bu yüzden await kullanıyoruz
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // yeni kullanıcı nesnesi hazırlanır
    const newUser = this.userRepo.create({
      ...createUserDto, // DTO'daki her şeyi al
      password: hashedPassword, // Ama şifreyi benim verdiğimle değiştir
    });

    return this.userRepo.save(newUser);
  }
}
