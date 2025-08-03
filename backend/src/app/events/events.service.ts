import { Injectable, Inject, HttpException } from '@nestjs/common';
import { EventsRepository } from './events.repository';
import { CreateEventDto } from '@libs/dtos';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly sequelize: Sequelize,
  ) {}

  async createEvent(event: CreateEventDto, userId: number) {
    return await this.eventsRepository.createEvent(event, userId);
  }

  async getEvents(page = 1, limit = 10) {
    const cacheKey = `events:page:${page}:limit:${limit}`;

    const cachedEvents = await this.cacheManager.get(cacheKey);
    if (cachedEvents) {
      return cachedEvents;
    }

    const events = await this.eventsRepository.getEvents(page, limit);

    await this.cacheManager.set(cacheKey, events);

    return events;
  }

  async getEventByIdCached(id: number) {
    const cacheKey = `event:${id}`;
    const cachedEvent: Event | undefined = await this.cacheManager.get(cacheKey);
    if (cachedEvent) {
      return cachedEvent;
    }

    const event = await this.eventsRepository.getEventById(id);
    if (!event) {
      throw new HttpException('Event not found', 404);
    }
    await this.cacheManager.set(cacheKey, event);
    return event;
  }

  async getEventById(id: number) {
    const event = await this.eventsRepository.getEventById(id);
    if (!event) {
      throw new HttpException('Event not found', 404);
    }
    return event;
  }

  async getEventByUserId(eventId: number, userId: number) {
    return await this.eventsRepository.getEventByUserId(eventId, userId);
  }

  async getMyEvents(userId: number) {
    return await this.eventsRepository.getMyEvents(userId);
  }

  async updateEventCurrentAttendees(eventId: number, process: 'increment' | 'decrement') {
    return await this.eventsRepository.updateEventCurrentAttendees(eventId, process);
  }
}
