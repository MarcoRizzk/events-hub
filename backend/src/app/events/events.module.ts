import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventsRepository } from './events.repository';
import { Event } from '@libs/models';
import { SequelizeModule } from '@nestjs/sequelize';
import { RsvpModule } from '@app/rsvp/rsvp.module';

@Module({
  imports: [SequelizeModule.forFeature([Event]), RsvpModule],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository],
})
export class EventsModule {}
