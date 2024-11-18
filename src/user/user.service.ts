import {
  NotFoundException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { notFoundExceptionMessage } from '@/helpers';

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

  public async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
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
    const user: User | null = await this.prisma.user.findUnique({
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
        version: user.version + 1,
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

  private refreshUser(user): User {
    return {
      ...user,
      createdAt:
        user.createdAt instanceof Date
          ? user.createdAt
          : new Date(user.createdAt),
      updatedAt:
        user.updatedAt instanceof Date
          ? user.updatedAt
          : new Date(user.updatedAt),
    };
  }

  private async findUser(id: string) {
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
