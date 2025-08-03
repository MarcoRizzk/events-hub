import { Module } from '@nestjs/common';
import { RsvpService } from './rsvp.service';
import { RsvpRepository } from './rsvp.repository';
import { Rsvp } from '@libs/models';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Rsvp])],
  providers: [RsvpService, RsvpRepository],
  exports: [RsvpService],
})
export class RsvpModule {}
