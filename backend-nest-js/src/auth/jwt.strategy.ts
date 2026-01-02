import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';

@Injectable() // injectable yapıyoruz ki başka yerlerde kullanabilelim
// gelen istekteki tokeni kontrol eder
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // token gelen isteğin neresinden okunacak onu belirtir. burada header'dan bearer token olarak okunacağı belirtilmiş.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // süresi bitmiş tokenleri reddet
      secretOrKey: jwtConstants.secret, // Şifreyi çözmek için anahtar
    });
  }

  // token geçerliyse içindeki veriyi (payload) okur ve request'e ekler
  async validate(payload: any) {
    // req.user = {userId: 1, username: 'ali', role: 'admin'}
    return {userId: payload.sub, username: payload.username, role: payload.role};
  }
}
