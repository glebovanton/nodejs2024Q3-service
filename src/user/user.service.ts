import {
  NotFoundException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { notFoundExceptionMessage } from '@/helpers';

@Injectable()
export class UserService {
  constructor(private dbService: DatabaseService) {}

  public findAll(): User[] {
    return this.dbService.users;
  }

  public findOne(id: string): User {
    return this.findUser(id);
  }

  public create(dto: CreateUserDto): User {
    const user: User = {
      id: uuidv4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...dto,
    };

    this.dbService.users.push(user);

    return user;
  }

  public update(id: string, dto: UpdatePasswordDto): User {
    const { oldPassword, newPassword } = dto;
    const user: User = this.findUser(id);
    const { password } = user;

    if (oldPassword !== password) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = newPassword;
    user.version++;
    user.updatedAt = Date.now();

    return user;
  }

  public delete(id: string): void {
    const user: User = this.findUser(id);
    const userIndex: number = this.dbService.users.indexOf(user);

    this.dbService.users.splice(userIndex, 1);
  }

  private findUser(id: string): User {
    const user: User | undefined = this.dbService.users.find(
      (user: User): boolean => user.id === id,
    );

    if (!user) {
      throw new NotFoundException(notFoundExceptionMessage(User));
    }

    return user;
  }
}
