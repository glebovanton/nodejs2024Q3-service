import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DatabaseService } from 'src/database/database.service';
import { Track } from 'src/track/entities/track.entity';

@Injectable()
export class AlbumService {
  constructor(private dbService: DatabaseService) {}

  public findAll(): Album[] {
    return this.dbService.albums;
  }

  public findOne(id: string): Album {
    return this.findAlbum(id);
  }

  public create(dto: CreateAlbumDto): Album {
    const album: Album = {
      id: uuidv4(),
      ...dto,
    };

    this.dbService.albums.push(album);

    return album;
  }

  public update(id: string, dto: UpdateAlbumDto): Album {
    const track: Album = this.findAlbum(id);

    return Object.assign(track, dto);
  }

  public delete(id: string): void {
    const album: Album = this.findAlbum(id);
    const albumIndex: number = this.dbService.albums.indexOf(album);

    this.dbService.albums.splice(albumIndex, 1);
    this.dbService.tracks
      .filter((track: Track): boolean => track.albumId === album.id)
      .forEach((track: Track): null => (track.albumId = null));

    const albumInFavorites: Album | undefined = this.dbService.favs.albums.find(
      (album: Album): boolean => album.id === id,
    );

    if (albumInFavorites) {
      const albumIndex: number = this.dbService.favs.albums.indexOf(albumInFavorites);
      this.dbService.favs.albums.splice(albumIndex, 1);
    }
  }

  private findAlbum(id: string): Album {
    const album: Album | undefined = this.dbService.albums.find(
      (album: Album): boolean => album.id === id,
    );

    if (!album) {
      throw new NotFoundException('Album with this ID not found');
    }

    return album;
  }
}
