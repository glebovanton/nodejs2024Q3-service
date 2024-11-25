import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { notFoundExceptionMessage } from 'src/helpers';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  public async add(entityName: string, entityId: string) {
    try {
      const { id } = await this.findAll();

      return await this.prisma.favorites.update({
        where: { id },
        data: { [`${entityName}s`]: { connect: { id: entityId } } },
        include: { [`${entityName}s`]: true },
      });
    } catch (error) {
      throw new UnprocessableEntityException('Invalid data');
    }
  }

  public async delete(entityName: string, entityId: string) {
    try {
      const { id } = await this.prisma.favorites.findFirstOrThrow({
        where: { [`${entityName}s`]: { some: { id: entityId } } },
      });

      return await this.prisma.favorites.update({
        where: { id },
        data: { [`${entityName}s`]: { disconnect: { id: entityId } } },
      });
    } catch (error) {
      throw new UnprocessableEntityException(
        notFoundExceptionMessage(entityName),
      );
    }
  }

  public async findAll() {
    return this.prisma.favorites.findFirst({
      include: { albums: true, artists: true, tracks: true },
    });
  }
}
