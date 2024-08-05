import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [MemberModule, AuthModule, BoardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
