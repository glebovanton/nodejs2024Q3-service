import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Track } from 'src/track/entities/track.entity';
import { notFoundExceptionMessage } from '@/helpers';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  public async findAll(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  public async findOne(id: string): Promise<Album> {
    return this.findAlbum(id);
  }

  public async create(dto: CreateAlbumDto): Promise<Album> {
    const album: Album = {
      id: uuidv4(),
      ...dto,
    };

    return await this.prisma.album.create({
      data: album,
    });
  }

  public async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    await this.findAlbum(id);

    const { artistId, ...rest } = dto;

    return await this.prisma.album.update({
      where: { id },
      data: {
        ...rest,
        artistId: artistId || null,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.findAlbum(id);
    await this.prisma.album.delete({
      where: { id },
    });
  }

  private async findAlbum(id: string): Promise<Album> {
    const album: Promise<Album | undefined> =
      await this.prisma.album.findUnique({
        where: { id },
      });

    if (!album) {
      throw new NotFoundException(notFoundExceptionMessage(Album));
    }

    return album;
  }
}
