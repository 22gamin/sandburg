import { Injectable } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoginService {

  constructor(private prismaService: PrismaService) {}

  async create(createLoginDto: CreateLoginDto): Promise<User> {

    const uuid = uuidv4();  // UUID 생성

    return this.prismaService.user.create({
      data: {
        email: createLoginDto.email,
        pw: createLoginDto.pw,
        name: createLoginDto.name,
        uuid: uuid,
        nickname: createLoginDto.nickname,
        status: false,
        role: 'USER',
      },
    });

        
  }
  //   }

  findAll() {
    return `This action returns all login`;
  }

  findOne(id: number) {
    return `This action returns a #${id} login`;
  }

  update(id: number, updateLoginDto: UpdateLoginDto) {
    return `This action updates a #${id} login`;
  }

  remove(id: number) {
    return `This action removes a #${id} login`;
  }
}
