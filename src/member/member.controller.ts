import {
  Controller,
  Post,
  Body,
  Delete,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { ResponseMsg } from 'src/auth/decorators/response-message-decorator';


@Controller('member')
@UseInterceptors(TransformInterceptor)
@ApiTags('회원')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Public()
  @Post('/signUp')
  @ResponseMsg('회원가입 성공')
  @ApiOperation({ summary: '회원가입 API' })
  @ApiBody({ type: CreateMemberDto })
  async create(@Body() createMemberDto: CreateMemberDto) {

    const user = await this.memberService.create(createMemberDto);

    if (user === null) {
      throw new HttpException({
        message: '이미 가입된 이메일입니다.',
        data: {},
      }, HttpStatus.FORBIDDEN);
    }

    return {};
  }

  @ApiBearerAuth('access-token')
  @Delete('/withdrawal')
  @ResponseMsg('탈퇴 성공')
  @ApiOperation({ summary: '회원 탈퇴 API' })
  withdrawal (@Req() req ){
    const uuid = req.user.uuid;
    this.memberService.update(uuid);
    return {};
  }



}
