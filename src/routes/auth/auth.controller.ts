import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { AuthDto, SocialAuthDto } from './dto';
import { JwtGuard } from './guard';

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

  // ** POST /auth/google-login
  @Post('google-login')
  loginInWithGoogle(@Body() socialAuthDto: SocialAuthDto) {
    return this.authService.loginInWithGoogle(
      socialAuthDto,
    );
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

  // ** POST /auth/admin/google-login
  @Post('admin/google-login')
  loginInAdminWithGoogle(
    @Body() socialAuthDto: SocialAuthDto,
  ) {
    return this.authService.loginInWithGoogle(
      socialAuthDto,
      true,
    );
  }

  // ** POST /auth/me
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser('id') uid: string) {
    return this.authService.getMe(uid);
  }
}
