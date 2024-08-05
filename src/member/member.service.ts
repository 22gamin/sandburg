import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { UserDeactivatedException } from 'src/exceptions/user-deactivated.exception';

@Injectable()
export class MemberService {

  constructor(private prismaService: PrismaService) {}

  async create(createMemberDto: CreateMemberDto): Promise<User> {
    // 1. 이메일로 사용자 확인
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: createMemberDto.email },
    });

    if (existingUser) {
      // 2. 사용자 상태 확인
      if (existingUser.status === true) {
        // 사용자 상태가 '탈퇴'인 경우
        return this.prismaService.user.update({
          where: { email: createMemberDto.email },
          data: {
            status: false, // 탈퇴 상태에서 활성 상태로 변경
          },
        });
      }
      // 탈퇴 상태가 아닌 경우
      return null;
    }
    
    const uuid = uuidv4();  // UUID 생성

    return this.prismaService.user.create({
      data: {
        email: createMemberDto.email,
        pw: createMemberDto.pw,
        name: createMemberDto.name,
        uuid: uuid,
        nickname: createMemberDto.nickname,
        status: false,
        role: 'USER',
      },
    });

  }

  async update(uuid: string) {
    return this.prismaService.user.update({
      where: { uuid },
      data: { status: true },
    });
  }

  findAll() {
    return `This action returns all member`;
  }

  async findOne(email: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
