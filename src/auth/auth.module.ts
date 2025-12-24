import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { User } from 'src/users/user.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    
    //auth kütüphanesi
    PassportModule,

    //token üretimi için jwt ayarları
    JwtModule.register({
      global: true, //token servisini tüm proje için erişilebilir
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' }, //token 1 saat sonra geçersiz olsun
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService], //başka modüller de kullanabilsin.
})
export class AuthModule {}
