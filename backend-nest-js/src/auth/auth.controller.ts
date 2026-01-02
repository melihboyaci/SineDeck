import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth (Kimlik İşlemleri)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Yeni Kullanıcı Kaydı (Register)' })
  @Post('register')
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    // DTO kontrolünden geçen veriyi servise gönder
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Giriş Yap (Login)' })
  @Post('login')
  async login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(loginUserDto);

    if (!user) {
      throw new UnauthorizedException('Wrong username or password');
    }

    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Kullanıcı Profilini Getir' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt')) // sadece geçerli tokeni olanlar girebilir
  @Get('profile')
  getProfile(@Request() req) {
    return req.user; //tokenin içinden çözdüğümüz bilgiyi (id, username, role) göster
  }
}
