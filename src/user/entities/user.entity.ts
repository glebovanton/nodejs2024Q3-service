import { Exclude } from 'class-transformer';

export class User {
  id: string;
  login: string;

  @Exclude()
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export class UpdatePasswordDto {
  @Exclude()
  oldPassword: string;
  @Exclude()
  newPassword: string;
}

export class UpdateUserDto {
  @Exclude()
  login: string;
  @Exclude()
  password: string;
}
