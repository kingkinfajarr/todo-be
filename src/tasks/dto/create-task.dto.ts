import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ description: 'The title of the task' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiPropertyOptional({ description: 'The description of the task' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({ description: 'The deadline of the task' })
  @IsOptional()
  @IsDateString({}, { message: 'Deadline must be a valid date string' })
  deadline?: string;
}
