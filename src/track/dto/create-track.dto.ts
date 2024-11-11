import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly artistId: string | null;

  @IsOptional()
  @IsString()
  readonly albumId: string | null;

  @IsNotEmpty()
  @IsNumber()
  readonly duration: number;
}
