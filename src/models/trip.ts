// @/models.ts
import { prop, getModelForClass } from '@typegoose/typegoose';

export class Trip {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public duration!: number;

  @prop({ required: false, default: true })
  public isCarTrip?: boolean;
}

export const TripModel = getModelForClass(Trip);
