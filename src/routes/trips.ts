/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trip, TripModel } from '../models/trip';
import type { Express, Request, Response } from 'express';

function buildTripRoutes(app: Express, jwtCheck: any, claimIncludes: any) {
  app.get(
    '/trips',
    jwtCheck,
    claimIncludes('permissions', 'read:user-inspirations'),
    async (_req: Request, res: Response): Promise<Response> => {
      const allTrips: Trip[] = await TripModel.find();
      await TripModel.create({
        duration: 5,
        name: 'Northern Lights',
        isCarTrip: true,
      });
      return res.status(200).json(allTrips);
    }
  );

  app.get('/trips/:id', async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const trip: Trip | null = await TripModel.findById(id);
    return res.status(200).json(trip);
  });

  app.post('/trips', async (req: Request, res: Response): Promise<Response> => {
    const dog: Trip = await TripModel.create({ ...req.body });
    return res.status(201).json(dog);
  });

  app.put('/trips/:id', async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    await TripModel.updateOne({ id }, req.body);
    const updatedDog: Trip | null = await TripModel.findById(id);
    return res.status(200).json(updatedDog);
  });

  app.delete('/trips/:id', async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const deletedTrip: Trip | null = await TripModel.findOneAndDelete({ id });
    return res.status(200).json(deletedTrip);
  });
}

export default buildTripRoutes;
