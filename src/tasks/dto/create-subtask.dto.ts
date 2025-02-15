import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateSubTaskDto {
  @ApiProperty({ type: [String], description: 'List of subtask titles' })
  @IsArray()
  @IsString({ each: true })
  titles: string[];
}
