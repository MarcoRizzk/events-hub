import { Controller, Post, Body, Get, Param, HttpException, Delete, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, CreateRsvpDto } from '@libs/dtos';
import { UserDto } from '@libs/dtos';
import { Public } from '@app/shared/decorators/public.decorator';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';
import { RsvpService } from '@app/rsvp/rsvp.service';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly rsvpService: RsvpService,
  ) {}

  @Post()
  async createEvent(@Body() event: CreateEventDto, @CurrentUser() user: UserDto) {
    return await this.eventsService.createEvent(event, user.id);
  }

  @Public()
  @Get()
  async getEvents(@Query('page') page = '1', @Query('limit') limit = '10') {
    const pageNumber = parseInt(page as any, 10) || 1;
    const limitNumber = parseInt(limit as any, 10) || 10;
    return await this.eventsService.getEvents(pageNumber, limitNumber);
  }

  @Get('my')
  async getMyEvents(@CurrentUser() user: UserDto) {
    return await this.eventsService.getMyEvents(user.id);
  }

  @Public()
  @Get(':id')
  async getEventById(@Param('id') id: number) {
    return await this.eventsService.getEventByIdCached(id);
  }

  @Post(':id/rsvp')
  async createRsvp(@Param('id') eventId: number, @CurrentUser() user: UserDto) {
    const event = await this.eventsService.getEventById(eventId);
    if (!event) {
      throw new HttpException('Event not found', 404);
    }
    if (event?.maxAttendees <= event.currentAttendees) {
      throw new HttpException('Event is full', 400);
    }
    if (event.createdBy === user.id) {
      throw new HttpException('You cannot RSVP for your own event', 400);
    }
    await this.eventsService.updateEventCurrentAttendees(eventId, 'increment');
    return await this.rsvpService.createRsvp(eventId, user.email, user.name);
  }

  @Get(':eventId/rsvp')
  async getRsvpByEventId(@Param('eventId') eventId: number, @CurrentUser() user: UserDto) {
    const event = await this.eventsService.getEventByUserId(eventId, user.id);
    if (!event) {
      throw new HttpException('Event not found', 404);
    }
    return await this.rsvpService.getRsvpByEventId(eventId);
  }

  @Delete(':eventId/rsvp')
  async deleteRsvp(@Param('eventId') eventId: number, @CurrentUser() user: UserDto) {
    await this.eventsService.updateEventCurrentAttendees(eventId, 'decrement');
    return await this.rsvpService.deleteRsvp(eventId, user.email);
  }

  @Get('rsvp/my')
  async getRsvpByUserEmail(@CurrentUser() user: UserDto) {
    return await this.rsvpService.getRsvpsByUserEmail(user.email);
  }
}
