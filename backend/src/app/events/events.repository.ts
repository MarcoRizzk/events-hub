import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from '@libs/models';
import { CreateEventDto } from '@libs/dtos';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class EventsRepository {
  constructor(
    @InjectModel(Event)
    private readonly eventModel: typeof Event,
    private readonly sequelize: Sequelize,
  ) {}

  async createEvent(event: CreateEventDto, userId: number) {
    return this.eventModel.create({ ...event, createdBy: userId });
  }

  async getEvents(page = 1, limit = 10) {
    const safePage = page < 1 ? 1 : page;
    const safeLimit = limit > 100 ? 100 : limit;
    const offset = (safePage - 1) * safeLimit;

    const { rows, count } = await this.eventModel.findAndCountAll({
      offset,
      limit: safeLimit,
      order: [['createdAt', 'DESC']],
    });

    const totalPages = Math.ceil(count / safeLimit);

    return {
      data: rows,
      total: count,
      totalPages,
      page: safePage,
      limit: safeLimit,
    };
  }

  async getEventById(id: number) {
    return this.eventModel.findOne({ where: { id } });
  }

  async getEventByUserId(eventId: number, userId: number) {
    return this.eventModel.findOne({ where: { id: eventId, createdBy: userId } });
  }

  async getMyEvents(userId: number) {
    return this.eventModel.findAll({ where: { createdBy: userId } });
  }

  async updateEventCurrentAttendees(eventId: number, process: 'increment' | 'decrement') {
    return this.sequelize.transaction(async (transaction) => {
      // Lock row for current transaction
      const event = await this.eventModel.findByPk(eventId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!event) {
        throw new HttpException('Event not found', 404);
      }

      if (process === 'increment') {
        if (event.currentAttendees >= event.maxAttendees) {
          throw new HttpException('Event is full', 400);
        }
        event.currentAttendees += 1;
      } else {
        if (event.currentAttendees <= 0) {
          throw new HttpException('No attendees to remove', 400);
        }
        event.currentAttendees -= 1;
      }

      await event.save({ transaction });
      return event.currentAttendees;
    });
  }
}
