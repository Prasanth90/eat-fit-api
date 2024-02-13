// @/models.ts
import { prop, getModelForClass, index } from '@typegoose/typegoose';

export class Quantity {
  @prop({ enum: ['ml', 'gram'], required: true })
  public unit!: string;
}

export class Macro {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public subCategory!: string;

  @prop({ required: true })
  public quantity!: Quantity;
}

export class FoodItem {
  @prop({ required: true })
  public name!: string;

  @prop({ required: false })
  public imageUrl?: string;

  @prop({ required: true })
  public calories!: number;

  @prop({ required: true })
  public protein!: number;

  @prop({ required: true })
  public carbohydrate!: number;

  @prop({ required: true })
  public fat!: number;

  @prop({ required: true })
  public price!: number;

  @prop({ required: true, default: [], type: () => [Macro] })
  public macros!: Macro[];
}

export class Location {
  @prop({ required: true, enum: ['Point'], default: 'Point' })
  type?: string;

  @prop({ required: true, type: () => [Number] })
  coordinates!: number[];
}

@index({ location: '2dsphere' })
export class Restaurant {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, index: '2dsphere', type: () => Location })
  public location!: Location;

  @prop({ required: true, type: () => [FoodItem] })
  public foodItems!: FoodItem[];
}

export const RestaurantModel = getModelForClass(Restaurant);
