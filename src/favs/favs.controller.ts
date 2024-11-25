import {
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
  add(@Param('entity') entity: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.add(entity, id);
  }

  @Delete(':entity/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.favsService.delete(entity, id);
  }

  private convertToPlural(entityName: string): FavEntity {
    return `${entityName}s` as FavEntity;
  }
}
