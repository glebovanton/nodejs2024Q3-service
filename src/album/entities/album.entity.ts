export type Album = {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
};

export class CreateAlbumDto {}

export class UpdateAlbumDto {}
