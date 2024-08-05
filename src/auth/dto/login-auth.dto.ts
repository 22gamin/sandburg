import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {

    @ApiProperty({
        description: 'The email address of the user',
        example: 'user@example.com'
      })
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @ApiProperty({
        description: 'The password for the user account',
        example: 'password123'
      })
    @IsString()
    @IsNotEmpty()
    pw: string;
}

