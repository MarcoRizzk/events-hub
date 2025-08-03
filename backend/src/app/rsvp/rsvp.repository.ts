import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Rsvp } from '@libs/models';
import { Event } from '@libs/models';

@Injectable()
export class RsvpRepository {
  constructor(
    @InjectModel(Rsvp)
    private readonly rsvpModel: typeof Rsvp,
  ) {}

  async createRsvp(eventId: number, userEmail: string, userName: string) {
    const rsvp = await this.rsvpModel.findOne({ where: { eventId, userEmail } });
    if (rsvp) {
      throw new HttpException('You have already RSVPed for this event', 400);
    }
    return this.rsvpModel.create({ eventId, userEmail, userName });
  }

  async getRsvpByEventId(eventId: number) {
    return this.rsvpModel.findAll({ where: { eventId } });
  }

  async deleteRsvp(eventId: number, userEmail: string) {
    return this.rsvpModel.destroy({ where: { eventId, userEmail } });
  }

  async getEventRsvpByUserEmail(eventId: number, userEmail: string) {
    return this.rsvpModel.findOne({ where: { eventId, userEmail } });
  }

  async getRsvpsByUserEmail(userEmail: string) {
    return this.rsvpModel.findAll({
      where: { userEmail },
      include: [
        {
          model: Event,
          attributes: ['title'],
        },
      ],
    });
  }
}
