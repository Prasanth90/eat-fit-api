import { Restaurant, RestaurantModel } from '../models/restaurant';

export class RestaurantRepository {
  public async createRestaurant(restaurantInput: Restaurant) {
    return RestaurantModel.create(restaurantInput);
  }
}
