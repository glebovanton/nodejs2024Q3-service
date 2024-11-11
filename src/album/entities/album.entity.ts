export class Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;

  constructor(id: string, name: string, year: number, artistId: string | null) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.artistId = artistId;
  }
}
