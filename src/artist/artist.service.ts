import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { notFoundExceptionMessage } from '@/helpers';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  public async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  public async findOne(id: string): Promise<Artist> {
    return await this.findArtist(id);
  }

  public async create(dto: CreateArtistDto): Promise<Artist> {
    return this.prisma.artist.create({
      data: dto,
    });
  }

  public async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
    await this.findArtist(id);

    return this.prisma.artist.update({
      where: { id },
      data: dto,
    });
  }

  public async delete(id: string): Promise<void> {
    await this.findArtist(id);

    await this.prisma.artist.delete({
      where: { id },
    });
  }

  private async findArtist(id: string): Promise<Artist> {
    const artist: Artist | null = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException(notFoundExceptionMessage(Artist));
    }

    return artist;
  }
}
