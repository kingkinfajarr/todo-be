import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  CreateSubTaskDto,
  UpdateSubTaskDto,
} from './dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('ongoing')
  @ApiOperation({ summary: 'Get all ongoing tasks' })
  @ApiResponse({ status: 200, description: 'List of ongoing tasks.' })
  getOngoingTasks() {
    return this.tasksService.getOngoingTasks();
  }

  @Get('completed')
  @ApiOperation({ summary: 'Get all completed tasks' })
  @ApiResponse({ status: 200, description: 'List of completed tasks.' })
  getCompletedTasks() {
    return this.tasksService.getCompletedTasks();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.deleteTask(id);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Complete a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'The task has been marked as completed.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  completeTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.completeTask(id);
  }

  @Post(':id/subtasks')
  @ApiOperation({ summary: 'Create multiple subtasks for a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 201,
    description: 'The subtasks have been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiBody({
    type: CreateSubTaskDto,
    examples: {
      single: {
        value: {
          titles: ['Subtask 1'],
        },
      },
      multiple: {
        value: {
          titles: ['Subtask 1', 'Subtask 2', 'Subtask 3'],
        },
      },
    },
  })
  createSubTask(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() createSubTaskDto: CreateSubTaskDto,
  ) {
    return this.tasksService.createSubTask(taskId, createSubTaskDto);
  }

  @Put('subtasks/:id')
  @ApiOperation({ summary: 'Update a subtask' })
  @ApiParam({ name: 'id', description: 'Subtask ID' })
  @ApiResponse({
    status: 200,
    description: 'The subtask has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Subtask not found.' })
  updateSubTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubTaskDto: UpdateSubTaskDto,
  ) {
    return this.tasksService.updateSubTask(id, updateSubTaskDto);
  }

  @Delete('subtasks/:id')
  @ApiOperation({ summary: 'Delete a subtask' })
  @ApiParam({ name: 'id', description: 'Subtask ID' })
  @ApiResponse({
    status: 200,
    description: 'The subtask has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Subtask not found.' })
  deleteSubTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.deleteSubTask(id);
  }

  @Put('subtasks/:id/complete')
  @ApiOperation({ summary: 'Complete a subtask' })
  @ApiParam({ name: 'id', description: 'Subtask ID' })
  @ApiResponse({
    status: 200,
    description: 'The subtask has been marked as completed.',
  })
  @ApiResponse({ status: 404, description: 'Subtask not found.' })
  completeSubTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.completeSubTask(id);
  }
}
