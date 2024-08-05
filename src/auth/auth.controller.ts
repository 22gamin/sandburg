import { Body, Controller, Post, HttpCode, HttpStatus,UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { ResponseMsg } from 'src/auth/decorators/response-message-decorator';


@Controller('auth')
@UseInterceptors(TransformInterceptor)
@ApiTags('로그인')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ResponseMsg('로그인 성공')
  @ApiOperation({ summary: '로그인 API' })
  @ApiBody({ type: LoginAuthDto })
  signIn(@Body() signInDto: LoginAuthDto) {
    return this.authService.signIn(signInDto.email, signInDto.pw);
  }
}
