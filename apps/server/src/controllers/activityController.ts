import { Request, Response } from 'express';
import { getPrismaClient } from '../utils/prisma';
import type { IActivity } from '@ocs/types';
import { getOrsGeocode } from '../utils/ors';
import { logActivitySchema } from '../utils/zod-schemas';

export const getUserActivities = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing or invalid fields.' });
    }

    const prisma = getPrismaClient();

    const activities = await prisma.activity.findMany({
      where: { userId },
      include: { cleanUpRoute: true },
    });

    return res.status(200).json({
      activities,
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    return res.status(500).json({ error: 'Failed to log activity' });
  }
};

export const logActivity = async (req: Request, res: Response) => {
  try {
    const parseResult = logActivitySchema.safeParse(req.body);

    if (!parseResult.success) {
      const errorMessages = parseResult.error.issues.map((e) => e.message);
      return res.status(400).json({ error: errorMessages });
    }

    const {
      coordinates,
      userId,
      activityDate,
      duration,
      distance,
      mostCommonItem,
    } = parseResult.data;

    const lat_lng = coordinates[0];

    const geocode = getOrsGeocode();

    const rev = await geocode.reverseGeocode({
      point: {
        lat_lng,
      },
      size: 1,
    });

    const zipcode = rev?.features?.[0]?.properties?.postalcode ?? '00000';

    const prisma = getPrismaClient();

    const cleanUpRoute = await prisma.cleanUpRoute.create({
      data: {
        coordinates,
        distance,
        duration,
        createdAt: new Date(),
        zipcode,
      },
    });

    const activity = await prisma.activity.create({
      data: {
        userId,
        activityDate: new Date(activityDate),
        mostCommonItem,
        cleanUpRouteId: cleanUpRoute.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        cleanUpRoute: true,
      },
    });

    return res.status(201).json({
      message: 'Activity logged successfully',
      activity,
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    return res.status(500).json({ error: 'Failed to log activity' });
  }
};
