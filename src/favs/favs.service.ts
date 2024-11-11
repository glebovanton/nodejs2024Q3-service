import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { notFoundExceptionMessage } from 'src/helpers';
import { Fav, FavEntity } from 'src/favs/entities/fav.entity';

@Injectable()
export class FavsService {
  constructor(private dbService: DatabaseService) {}

  public findAll(): Fav {
    return this.dbService.favs;
  }

  public add(entityName: FavEntity, id: string): void {
    const entity: Artist | Album | Track = this.findEntity(entityName, id);

    const entityInFavs: Artist | Album | Track | undefined =
      this.findEntityInFavs(entityName, id);

    if (!entityInFavs) {
      this.dbService.favs[entityName].push(entity);
    }
  }

  public delete(entityName: FavEntity, id: string): void {
    const entityInFavs: Artist | Album | Track | undefined =
      this.findEntityInFavs(entityName, id);

    if (!entityInFavs) {
      throw new NotFoundException(notFoundExceptionMessage(entityName));
    }

    const entityIndex: number =
      this.dbService.favs[entityName].indexOf(entityInFavs);

    this.dbService.favs[entityName].splice(entityIndex, 1);
  }

  private findEntity(
    entityName: FavEntity,
    id: string,
  ): Artist | Album | Track {
    const entity: Artist | Album | Track | undefined = this.dbService[
      entityName
    ].find((entity: Artist | Album | Track): boolean => entity.id === id);

    if (!entity) {
      throw new UnprocessableEntityException(
        notFoundExceptionMessage(entityName),
      );
    }

    return entity;
  }

  private findEntityInFavs(
    entityName: FavEntity,
    id: string,
  ): Artist | Album | Track | undefined {
    return this.dbService.favs[entityName].find(
      (entity: Artist | Album | Track): boolean => entity.id === id,
    );
  }
}
