import { HttpException, Injectable } from '@nestjs/common';
import { RsvpRepository } from './rsvp.repository';
import { CreateRsvpDto } from '@libs/dtos';

@Injectable()
export class RsvpService {
  constructor(private readonly rsvpRepository: RsvpRepository) {}

  async createRsvp(eventId: number, userEmail: string, userName: string) {
    return this.rsvpRepository.createRsvp(eventId, userEmail, userName);
  }

  async getRsvpByEventId(eventId: number) {
    const rsvp = await this.rsvpRepository.getRsvpByEventId(eventId);
    return rsvp;
  }

  async deleteRsvp(eventId: number, userEmail: string) {
    const rsvp = await this.rsvpRepository.getEventRsvpByUserEmail(eventId, userEmail);
    if (!rsvp) {
      throw new HttpException('Rsvp not found', 404);
    }
    try {
      await this.rsvpRepository.deleteRsvp(eventId, userEmail);
    } catch (error) {
      throw new HttpException('Failed to delete rsvp', 500);
    }
    return 'Rsvp deleted successfully';
  }

  async getRsvpsByUserEmail(userEmail: string) {
    const rsvp = await this.rsvpRepository.getRsvpsByUserEmail(userEmail);
    return rsvp;
  }
}
