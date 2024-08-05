import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BoardService {

  constructor(private prismaService: PrismaService) {}

  async create(uuid: string, boardId: number, createBoardDto: CreateBoardDto): Promise<Post> {

    return this.prismaService.post.create({
      data: {
        uuid: uuid,
        title: createBoardDto.title,
        content: createBoardDto.content,
        createdAt: new Date(),
        updatedAt: new Date(),
        boardId: boardId,
      },
    });
  }

  findAll(boardId: number) {
    return this.prismaService.post.findMany({
      where: {
        boardId: boardId,
      },
    });
  }

  async findOne(postId: number) {
    if (!postId) {
      return { message: '게시글이 존재하지 않습니다.' };
    }
    return this.prismaService.post.findUnique({
      where: { id: postId },
      });
  }

  async update(uuid: string, postId:number, updateBoardDto: UpdateBoardDto) {

    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
    });

    if (uuid !== post.uuid) {
      return null;
    }
    return this.prismaService.post.update({
      where: { id: postId },
      data: {
        title: updateBoardDto.title,
        content: updateBoardDto.content,
        updatedAt: new Date(),
      },
    })
  }

  async remove(user: any,postId: number) {

    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
    });
    
    // 게시글이 존재하는지 확인
    if (!post) {
      return 1;
    }
    console.log('user2:',user);
    // 게시글 작성자 혹은 관리자만 삭제 가능
    if (user.role !== 'ADMIN' && user.uuid !== post.uuid) {
      return 2; // 권한 없음
    }
    return this.prismaService.post.delete({
      where: { id: postId },
    })
  }


}
