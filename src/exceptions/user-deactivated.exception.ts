import { HttpException, HttpStatus } from '@nestjs/common';

export class UserDeactivatedException extends HttpException {
    constructor(
      message: string = 'User with this email already exists.',
      errorCode: string = 'USER_EXISTS',
    ) {
      // HttpException 생성자에 메시지와 상태 코드를 전달합니다.
      super({ message, errorCode }, HttpStatus.FORBIDDEN);
    }
  }