import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Header,
  HttpCode,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistService } from '@/artist/artist.service';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  findAll(): Artist[] {
    return this.artistService.findAll();
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  findOne(@Param('id', ParseUUIDPipe) id: string): Artist {
    return this.artistService.findOne(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @Header('Content-Type', 'application/json')
  create(@Body() dto: CreateArtistDto): Artist {
    return this.artistService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Header('Content-Type', 'application/json')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateArtistDto,
  ): Artist {
    return this.artistService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseUUIDPipe) id: string): void {
    this.artistService.delete(id);
  }
}
