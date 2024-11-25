import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';

export type Fav = {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
};

export type FavEntity = FavType.track | FavType.album | FavType.artist;

export enum FavType {
  artist = 'artist',
  album = 'album',
  track = 'track',
}

export const entityMap = {
  [`${FavType.artist}s`]: FavType.artist,
  [`${FavType.album}s`]: FavType.album,
  [`${FavType.track}s`]: FavType.track,
};
