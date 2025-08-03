import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
  CreatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Event } from './event.model';

interface RsvpCreationAttributes {
  eventId: number;
  userEmail: string;
  userName: string;
}

@Table({
  tableName: 'rsvps',
  timestamps: true,
  underscored: true,
})
export class Rsvp extends Model<Rsvp, RsvpCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Event)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    field: 'event_id',
  })
  declare eventId: number;

  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    field: 'user_email',
  })
  declare userEmail: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    field: 'user_name',
  })
  declare userName: string;

  @BelongsTo(() => Event)
  declare event: Event;
}
