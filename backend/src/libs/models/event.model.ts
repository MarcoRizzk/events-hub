import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

export interface EventCreationAttributes {
  title: string;
  description: string;
  location: string;
  date: Date;
  maxAttendees: number;
  createdBy: number;
}

@Table({
  tableName: 'events',
  timestamps: true,
  underscored: true,
})
export class Event extends Model<Event, EventCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column(DataType.STRING)
  declare title: string;

  @Column(DataType.STRING)
  declare description: string;

  @Column(DataType.STRING)
  declare location: string;

  @Column(DataType.DATE)
  declare date: Date;

  @Column({
    type: DataType.INTEGER,
    field: 'max_attendees',
  })
  declare maxAttendees: number;

  @Column({
    type: DataType.INTEGER,
    field: 'current_attendees',
    defaultValue: 0,
  })
  declare currentAttendees: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'created_by',
    allowNull: false,
  })
  declare createdBy: number;

  @BelongsTo(() => User)
  declare user: User;
}
