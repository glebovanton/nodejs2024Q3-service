import {
  NotFoundException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { notFoundExceptionMessage } from '@/helpers';
import { Track } from '@/track/entities/track.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  public async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users.map((user) => this.refreshUser(user));
  }

  public async findOne(id: string): Promise<User> {
    const user = await this.findUser(id);

    return this.refreshUser(user);
  }

  public async create(dto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...dto,
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  public async update(id: string, dto: UpdatePasswordDto): Promise<User> {
    const { oldPassword, newPassword }: UpdatePasswordDto = dto;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        login: true,
        password: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(notFoundExceptionMessage(User));
    }

    const { password } = user;

    if (oldPassword !== password) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: newPassword,
        version: user.version++,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return this.refreshUser(updatedUser);
  }

  public async delete(id: string): Promise<void> {
    await this.findUser(id);
    await this.prisma.user.delete({
      where: { id },
    });
  }

  private refreshUser(user: User): User {
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  }

  private async findUser(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(notFoundExceptionMessage(User));
    }

    return user;
  }
}
