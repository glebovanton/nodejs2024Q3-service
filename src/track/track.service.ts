import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { DatabaseService } from 'src/database/database.service';
import { notFoundExceptionMessage } from '@/helpers';

@Injectable()
export class TrackService {
  constructor(private dbService: DatabaseService) {}

  public findAll(): Track[] {
    return this.dbService.tracks;
  }

  public findOne(id: string): Track {
    return this.findTrack(id);
  }

  public create(dto: CreateTrackDto): Track {
    const track: Track = {
      id: uuidv4(),
      ...dto,
    };

    this.dbService.tracks.push(track);

    return track;
  }

  public update(id: string, dto: UpdateTrackDto): Track {
    const track: Track = this.findTrack(id);

    return Object.assign(track, dto);
  }

  public delete(id: string): void {
    const track: Track = this.findTrack(id);
    const trackIndex: number = this.dbService.tracks.indexOf(track);

    this.dbService.tracks.splice(trackIndex, 1);
    const trackInFavorites: Track | undefined = this.dbService.favs.tracks.find(
      (track: Track): boolean => track.id === id,
    );

    if (trackInFavorites) {
      const trackIndex: number =
        this.dbService.favs.tracks.indexOf(trackInFavorites);
      this.dbService.favs.tracks.splice(trackIndex, 1);
    }
  }

  private findTrack(id: string): Track {
    const track: Track | undefined = this.dbService.tracks.find(
      (track: Track): boolean => track.id === id,
    );

    if (!track) {
      throw new NotFoundException(notFoundExceptionMessage(Track));
    }

    return track;
  }
}
