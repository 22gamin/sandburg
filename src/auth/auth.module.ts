import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MemberModule } from 'src/member/member.module';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { MemberService } from 'src/member/member.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [MemberModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),],
  providers: [AuthService,JwtService, PrismaService,MemberService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
