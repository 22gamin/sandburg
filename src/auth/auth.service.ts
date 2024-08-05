import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MemberService } from 'src/member/member.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { PrismaService } from 'src/prisma.service';
import { jwtConstants } from './constants';


@Injectable()
export class AuthService {

    constructor(
        private memberService: MemberService,
        private jwtService: JwtService,
        private prisma: PrismaService
    ) {}

    async signIn(
        email: string, 
        password: string)
        : Promise<{ access_token: string }> {

        // 비밀번호 확인 및 탈퇴 유저 확인
        const user = await this.memberService.findOne(email);
        if (user?.pw !== password || user.status === true) {
          throw new UnauthorizedException();
        }


        let payload: JwtPayload;

        if (user.role === 'ADMIN') {

          // 관리자 권한 및 게시판 권한 조회
          const userPermissions = await this.prisma.boardRole.findMany({
            where: { uuid: user.uuid },
          });


          payload = {
            uuid: user.uuid,
            nickname: user.nickname,
            role: user.role,
            permissions: userPermissions.map(permission => permission.boardId),
          };

        } else {
          // 5. 일반 사용자 처리
          payload = {
            uuid: user.uuid,
            nickname: user.nickname,
            role: user.role,
          };
        }
    
        // 6. JWT 생성
        const secret = jwtConstants.secret;
        const token = this.jwtService.sign(payload, { secret: secret,expiresIn: '1h' });
    
        return { access_token: token };

      }
}
