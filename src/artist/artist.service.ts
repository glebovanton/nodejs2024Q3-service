import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { Album } from 'src/album/entities/album.entity';
import { DatabaseService } from 'src/database/database.service';
import { notFoundExceptionMessage } from '@/helpers';

@Injectable()
export class ArtistService {
  constructor(private dbService: DatabaseService) {}

  public findAll(): Artist[] {
    return this.dbService.artists;
  }

  public findOne(id: string): Artist {
    return this.findArtist(id);
  }

  public create(dto: CreateArtistDto): Artist {
    const artist: Artist = {
      id: uuidv4(),
      ...dto,
    };

    this.dbService.artists.push(artist);

    return artist;
  }

  public update(id: string, dto: UpdateArtistDto): Artist {
    const artist: Artist = this.findArtist(id);

    return Object.assign(artist, dto);
  }

  public delete(id: string): void {
    const artist: Artist = this.findArtist(id);
    const artistIndex: number = this.dbService.artists.indexOf(artist);

    this.dbService.artists.splice(artistIndex, 1);
    this.dbService.tracks
      .filter((track: Track): boolean => track.artistId === artist.id)
      .forEach((track: Track) => (track.artistId = null));
    this.dbService.albums
      .filter((album: Album): boolean => album.artistId === artist.id)
      .forEach((album: Album) => (album.artistId = null));

    const artistInFavorites: Artist | undefined =
      this.dbService.favs.artists.find(
        (artist: Artist): boolean => artist.id === id,
      );

    if (artistInFavorites) {
      const artistIndex: number =
        this.dbService.favs.artists.indexOf(artistInFavorites);
      this.dbService.favs.artists.splice(artistIndex, 1);
    }
  }

  private findArtist(id: string): Artist {
    const artist: Artist | undefined = this.dbService.artists.find(
      (artist: Artist): boolean => artist.id === id,
    );

    if (!artist) {
      throw new NotFoundException(notFoundExceptionMessage(Artist));
    }

    return artist;
  }
}
