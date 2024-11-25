import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { notFoundExceptionMessage } from '@/helpers';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  public async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  public async findOne(id: string): Promise<Album> {
    return this.findAlbum(id);
  }

  public async create({
    name,
    year,
    artistId,
  }: CreateAlbumDto): Promise<Album> {
    const album = new Album(name, year, artistId);

    return this.prisma.album.create({
      data: album,
    });
  }

  public async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    await this.findAlbum(id);

    return this.prisma.album.update({ where: { id }, data: dto });
  }

  public async delete(id: string): Promise<void> {
    await this.findAlbum(id);
    await this.prisma.album.delete({
      where: { id },
    });
  }

  private async findAlbum(id: string): Promise<Album> {
    const album: Album | undefined = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException(notFoundExceptionMessage(Album));
    }

    return album;
  }
}
