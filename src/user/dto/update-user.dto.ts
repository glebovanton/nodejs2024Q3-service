import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { minPassLength } from '../../helpers';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  readonly oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(minPassLength)
  readonly newPassword: string;
}
