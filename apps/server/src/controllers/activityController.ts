import { Request, Response } from 'express';
import { getPrismaClient } from '../utils/prisma';
import type { IActivity } from '@ocs/types';

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
    const {
      coordinates,
      userId,
      activityDate,
      duration,
      distance,
      mostCommonItem,
    } = req.body;

    // Basic validation -- TODO: Add Zod Schema
    if (
      !userId ||
      !activityDate ||
      !coordinates ||
      !Array.isArray(coordinates)
    ) {
      return res.status(400).json({ error: 'Missing or invalid fields.' });
    }

    const prisma = getPrismaClient();

    const cleanUpRoute = await prisma.cleanUpRoute.create({
      data: {
        coordinates,
        distance,
        duration,
        createdAt: new Date(),
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
