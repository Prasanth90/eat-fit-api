/* eslint-disable @typescript-eslint/no-explicit-any */
import { RestaurantModel } from '../models/restaurant';
import * as subway from '../mocks/subway.json';
import * as shawarma from '../mocks/shawarma.json';
import * as mandarin from '../mocks/mandarin.json';
import type { Express, Request, Response } from 'express';
import { RestaurantService } from '../services/restaurant_service';
const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100000;

const parseNumber = (req: Request, propName: string, defaultValue: number) => {
  return parseInt(req.query[propName] as string) || defaultValue;
};

function buildRestaurantRoutes(app: Express) {
  app.get('/restaurants', async (_req: Request, res: Response): Promise<Response> => {
    const restaurantService = new RestaurantService();
    try {
      await restaurantService.createRestaurant(subway);
      await restaurantService.createRestaurant(shawarma);
      await restaurantService.createRestaurant(mandarin);
    } catch (e: any) {
      console.log(e);
    }

    const restaurants = await RestaurantModel.find();

    return res.status(200).json(restaurants);
  });

  app.get('/nearby/:calories', async (req: Request, res: Response): Promise<Response> => {
    const calories: number = parseInt(req.params['calories'] || '');

    const protein_min: number = parseNumber(req, 'protein_min', DEFAULT_MIN);
    const carbohydrate_min: number = parseNumber(req, 'carbohydrate_min', DEFAULT_MIN);
    const fat_min: number = parseNumber(req, 'fat_min', DEFAULT_MIN);
    const price_min: number = parseNumber(req, 'price_min', DEFAULT_MIN);

    const protein_max: number = parseNumber(req, 'protein_max', DEFAULT_MAX);
    const carbohydrate_max: number = parseNumber(req, 'carbohydrate_max', DEFAULT_MAX);
    const fat_max: number = parseNumber(req, 'fat_max', DEFAULT_MAX);
    const price_max: number = parseNumber(req, 'price_max', DEFAULT_MAX);

    console.log({ protein_min, protein_max, carbohydrate_min, carbohydrate_max, fat_min, fat_max });

    try {
      const nearbyRestaurants = await RestaurantModel.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [-75.77411721605776, 45.26824473535651],
            },
            distanceField: 'distance',
            spherical: true,
            maxDistance: 2000,
          },
        },
        {
          $project: {
            id: 1,
            name: 1,
            location: 1,
            foodItems: {
              $filter: {
                input: '$foodItems',
                as: 'foodItem',
                cond: {
                  $and: [
                    { $gte: ['$$foodItem.calories', calories] },
                    { $lte: ['$$foodItem.price', price_max] },
                    { $lte: ['$$foodItem.protein', protein_max] },
                    { $lte: ['$$foodItem.fat', fat_max] },
                    { $lte: ['$$foodItem.carbohydrate', carbohydrate_max] },
                    { $gte: ['$$foodItem.price', price_min] },
                    { $gte: ['$$foodItem.protein', protein_min] },
                    { $gte: ['$$foodItem.fat', fat_min] },
                    { $gte: ['$$foodItem.carbohydrate', carbohydrate_min] },
                  ],
                },
              },
            },
          },
        },
        {
          $addFields: {
            numberOfFoodItems: {
              $cond: {
                if: {
                  $isArray: '$foodItems',
                },
                then: {
                  $size: '$foodItems',
                },
                else: 'NA',
              },
            },
          },
        },
        {
          $match: {
            numberOfFoodItems: {
              $gt: 0,
            },
          },
        },
      ]);
      return res.status(200).json(nearbyRestaurants);
    } catch (e) {
      console.log(e);
    }

    return res.status(200).json([]);
  });
}

export default buildRestaurantRoutes;
