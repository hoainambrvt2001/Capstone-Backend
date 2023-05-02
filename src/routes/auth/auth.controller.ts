import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ** POST /auth/signup
  @Post('signup')
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  // ** POST /auth/login
  @Post('login')
  loginIn(@Body() authDto: AuthDto) {
    return this.authService.loginIn(authDto);
  }

  // ** POST /auth/admin/signup
  @Post('admin/signup')
  signUpAdmin(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto, true);
  }

  // ** POST /auth/admin/login
  @Post('admin/login')
  loginInAdmin(@Body() authDto: AuthDto) {
    return this.authService.loginIn(authDto, true);
  }
}
