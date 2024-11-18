import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { notFoundExceptionMessage } from 'src/helpers';
import { Fav, FavEntity } from 'src/favs/entities/fav.entity';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  public async findAll(): Promise<Fav> {
    await this.getFavorites();

    return this.prisma.favorites.findFirst({
      select: {
        artists: {
          select: {
            id: true,
            name: true,
            grammy: true,
          },
        },
        albums: {
          select: {
            id: true,
            name: true,
            year: true,
            artistId: true,
          },
        },
        tracks: {
          select: {
            id: true,
            name: true,
            duration: true,
            artistId: true,
            albumId: true,
          },
        },
      },
    });
  }

  public async add(entityName: FavEntity, id: string): Promise<void> {
    await this.findEntity(entityName, id);

    const favorites = await this.getFavorites();

    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: { [`${entityName}s`]: { connect: { id } } },
    });
  }

  public async delete(entityName: FavEntity, id: string): Promise<void> {
    await this.findEntity(entityName, id);

    const favorites = await this.getFavorites();

    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: { [`${entityName}s`]: { disconnect: { id } } },
    });
  }

  private async findEntity(
    entityName: FavEntity,
    id: string,
  ): Promise<Artist | Album | Track> {
    const entity: Artist | Album | Track | undefined = await (
      this.prisma as any
    )[entityName].findUnique({
      where: { id },
    });

    if (!entity) {
      throw new UnprocessableEntityException(
        notFoundExceptionMessage(entityName),
      );
    }

    return entity;
  }

  private async getFavorites(): Promise<{ id: string } | undefined> {
    const favorites = await this.prisma.favorites.findFirst();

    if (!favorites) {
      await this.prisma.favorites.create({ data: {} });

      return undefined;
    }

    return favorites;
  }
}
