import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ApiTags, ApiOperation, ApiBody,ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { ResponseMsg } from 'src/auth/decorators/response-message-decorator';


@Controller('board')
@UseInterceptors(TransformInterceptor)
@ApiTags('게시판')
@ApiBearerAuth('access-token')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post(':boardId/create')
  @ResponseMsg('게시글 작성 성공')
  @ApiOperation({ summary: '게시글 작성 API' })
  @ApiBody({ type: CreateBoardDto })
  create(
    @Req() req,
    @Param('boardId') boardId: number,
    @Body() createBoardDto: CreateBoardDto,
  ) {
    const uuid = req.user.uuid;
    console.log(req.user);

    if (boardId === 1 || boardId === 3) { 
      // 1: 운영게시판, 3: 공지게시판

      if (req.user.role !== 'ADMIN') {
        throw new HttpException({
          message: '권한이 없습니다.',
          data: {},
        }, HttpStatus.FORBIDDEN); // 403 Forbidden 상태 코드 사용
      }
      }

    this.boardService.create(uuid, boardId, createBoardDto);
    return {};
  }

  @Patch(':boardId/:postId')
  @ResponseMsg('게시글 수정 성공')
  @ApiOperation({ summary: '게시글 수정 API' })
  @ApiBody({ type: UpdateBoardDto })
  async updatePost(
    @Req() req,
    @Param('postId') postId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    const uuid = req.user.uuid;

    const post = await this.boardService.update(uuid,postId, updateBoardDto);

    if (post === null) {
      throw new HttpException({
        message: '게시글 작성자만 수정할 수 있습니다.',
        data: {},
      }, HttpStatus.NOT_FOUND); // 404 Not Found 상태 코드 사용
    }
    
    return {};
  }

  @Delete(':boardId/:postId')
  @ResponseMsg('게시글 삭제 성공')
  @ApiOperation({ summary: '게시글 삭제 API' })
  async remove(@Req() req, @Param('postId') postId: number) {
    const user = req.user;
    const post = await this.boardService.remove(user,postId);

    if (post === 1) {
      throw new HttpException({
        message: '게시글이 존재하지 않습니다.',
        data: {},
      }, HttpStatus.NOT_FOUND); // 404 Not Found 상태 코드 사용
    }


    if (post === 2) {
      throw new HttpException({
        message: '게시글 작성자만 삭제할 수 있습니다.',
        data: {},
      }, HttpStatus.FORBIDDEN); // 403 Forbidden 상태 코드 사용
    }

    return {};
  }

  @Public()
  @Get(':boardId')
  @ResponseMsg('게시글 전체 조회 성공')
  @ApiOperation({ summary: '게시글 전체 조회 API' })
  findAll(@Param('boardId') boardId: number) {
    return this.boardService.findAll(boardId);
  }

  @Public()
  @Get(':boardId/:postId')
  @ResponseMsg('특정 게시글 조회 성공')
  @ApiOperation({ summary: '특정 게시글 조회 API' })
  findOne(@Param('postId') postId: number) {
    return this.boardService.findOne(postId);
  }

}
