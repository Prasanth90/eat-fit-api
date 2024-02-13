import { RestaurantRepository } from '../repositories/restaurant_repository';
import type { Restaurant } from '../models/restaurant';

export class RestaurantService {
  private _restaurantRepository: RestaurantRepository;

  constructor() {
    this._restaurantRepository = new RestaurantRepository();
  }

  public async createRestaurant(restaurantInput: Restaurant) {
    const restaurant = await this._restaurantRepository.createRestaurant(restaurantInput);
    return restaurant;
  }
}
