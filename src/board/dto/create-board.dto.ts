import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateBoardDto {

    @ApiProperty({
        description: 'title',
      })
    @IsString()
    @IsNotEmpty()
    @MinLength(5, {
      message: "제목은 $constraint1 자 이상이어야 합니다.",
    })
    @MaxLength(30, {
      message: "제목은 $constraint1 자를 넘길 수 없습니다.",
    })
    title: string;

    @ApiProperty({
        description: 'content',
      })
    @IsString()
    @IsNotEmpty()
    @MinLength(5, {
      message: "내용은 $constraint1 자 이상이어야 합니다.",
    })
    content: string;

}
