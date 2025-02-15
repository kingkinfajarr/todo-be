import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  CreateSubTaskDto,
  UpdateSubTaskDto,
} from './dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        deadline: createTaskDto.deadline
          ? new Date(createTaskDto.deadline)
          : null,
      },
      include: { subTasks: true },
    });
  }

  async getOngoingTasks() {
    return this.prisma.task.findMany({
      where: { isCompleted: false },
      include: { subTasks: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCompletedTasks() {
    return this.prisma.task.findMany({
      where: { isCompleted: true },
      include: { subTasks: true },
      orderBy: { completedAt: 'desc' },
    });
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: {
        ...updateTaskDto,
        deadline: updateTaskDto.deadline
          ? new Date(updateTaskDto.deadline)
          : null,
      },
      include: { subTasks: true },
    });
  }

  async deleteTask(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async completeTask(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { subTasks: true },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        isCompleted: !task.isCompleted,
        completedAt: !task.isCompleted ? new Date() : null,
        subTasks: {
          updateMany: {
            where: { taskId: id },
            data: {
              isCompleted: !task.isCompleted,
              completedAt: !task.isCompleted ? new Date() : null,
            },
          },
        },
      },
      include: { subTasks: true },
    });
  }

  async createSubTask(taskId: number, createSubTaskDto: CreateSubTaskDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.subTask.createMany({
        data: createSubTaskDto.titles.map((title) => ({
          title,
          taskId,
        })),
      });

      await this.updateTaskProgress(taskId);

      return tx.task.findUnique({
        where: { id: taskId },
        include: { subTasks: true },
      });
    });

    return result;
  }

  async updateSubTask(id: number, updateSubTaskDto: UpdateSubTaskDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const updatedSubTask = await tx.subTask.update({
        where: { id: id },
        data: {
          title: updateSubTaskDto.title,
        },
      });

      const subTask = await tx.subTask.findUnique({
        where: { id: id },
        select: { taskId: true },
      });

      if (subTask?.taskId) {
        await this.updateTaskProgress(subTask.taskId);
      }

      return updatedSubTask;
    });

    return result;
  }

  async deleteSubTask(id: number) {
    const subTask = await this.prisma.subTask.findUnique({
      where: { id },
    });

    await this.prisma.subTask.delete({
      where: { id },
    });

    await this.updateTaskProgress(subTask.taskId);
  }

  async completeSubTask(id: number) {
    const subTask = await this.prisma.subTask.findUnique({
      where: { id },
    });

    if (!subTask) {
      throw new NotFoundException(`SubTask with ID ${id} not found`);
    }

    const updatedSubTask = await this.prisma.subTask.update({
      where: { id },
      data: {
        isCompleted: !subTask.isCompleted,
        completedAt: !subTask.isCompleted ? new Date() : null,
      },
    });

    await this.updateTaskProgress(updatedSubTask.taskId);

    return updatedSubTask;
  }

  private async updateTaskProgress(taskId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { subTasks: true },
    });

    if (!task.subTasks.length) {
      return;
    }

    const completedSubTasks = task.subTasks.filter(
      (st) => st.isCompleted,
    ).length;
    const progress = (completedSubTasks / task.subTasks.length) * 100;
    const isCompleted = progress === 100;

    await this.prisma.task.update({
      where: { id: taskId },
      data: {
        progress,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });
  }

  async checkDueTasks() {
    const now = new Date();
    await this.prisma.task.updateMany({
      where: {
        deadline: {
          lt: now,
        },
        isCompleted: false,
      },
      data: {
        isDue: true,
      },
    });
  }
}
