import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateSubTaskDto {
  @ApiProperty({
    description: 'New subtask title',
    example: 'Updated subtask title',
  })
  @IsString()
  title: string;
}
