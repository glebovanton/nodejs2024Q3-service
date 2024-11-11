import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { minPassLength } from '../../helpers';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly login: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(minPassLength)
  readonly password: string;
}
