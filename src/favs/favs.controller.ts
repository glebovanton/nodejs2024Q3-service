import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { capitalizeFirstLetter } from 'src/helpers';
import { Fav, FavEntity } from './entities/fav.entity';

@Controller('favs')
export class FavsController {
  private entities = ['track', 'album', 'artist'];

  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll(): Promise<Fav> {
    return this.favsService.findAll();
  }

  @Post(':entity/:id')
  add(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): string {
    if (this.entities.includes(entity)) {
      this.favsService.add(this.convertToPlural(entity), id);

      return `${capitalizeFirstLetter(entity)} successfully added to favorites`;
    } else {
      throw new BadRequestException('Invalid entity');
    }
  }

  @Delete(':entity/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): string {
    if (this.entities.includes(entity)) {
      this.favsService.delete(this.convertToPlural(entity), id);

      return `${capitalizeFirstLetter(
        entity,
      )} successfully deleted from favorites`;
    } else {
      throw new BadRequestException('Invalid entity');
    }
  }

  private convertToPlural(entityName: string): FavEntity {
    return `${entityName}s` as FavEntity;
  }
}
