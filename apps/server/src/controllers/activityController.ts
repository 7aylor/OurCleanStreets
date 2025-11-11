import { Request, Response } from 'express';
import { getPrismaClient } from '../utils/prisma';
import type { Achievement, GeocodeResult, IActivity } from '@ocs/types';
import { getOrsGeocode } from '../utils/ors';
import { logActivitySchema } from '../utils/zod-schemas';
import { ACHIEVEMENT_CONFIG } from '../config/achievements.config';
import { convertDistance, getDurationParts } from '@ocs/library';

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
    console.error('Error getting user activities: ', error);
    return res.status(500).json({ error: 'Failed to get user activities' });
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
      trashWeight,
    } = parseResult.data;

    const lat_lng = coordinates[0];

    const geocode = getOrsGeocode();

    const rev: GeocodeResult = await geocode.reverseGeocode({
      point: {
        lat_lng,
      },
    });

    const featureWithZipcode = rev?.features?.find(
      (f) => f.properties?.postalcode
    );

    const zipcode = featureWithZipcode?.properties?.postalcode ?? '00000';

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
        trashWeight: trashWeight ?? 0,
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
    console.error('Error logging activity: ', error);
    return res.status(500).json({ error: 'Failed to log activity' });
  }
};

export const getUserStats = async (req: Request, res: Response) => {
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

    const totalDuration = activities.reduce((acc, curr) => {
      return acc + curr.cleanUpRoute.duration;
    }, 0);

    const totalDistance = activities.reduce((acc, curr) => {
      return acc + curr.cleanUpRoute.distance;
    }, 0);

    const totalWeight = activities.reduce((acc, curr) => {
      return acc + (curr.trashWeight ?? 0);
    }, 0);

    const { distance, duration, weight } = ACHIEVEMENT_CONFIG;

    const { hours, minutes, seconds } = getDurationParts(totalDuration);

    const miles = convertDistance(totalDistance, 'm');
    const totalTime = hours + minutes / 60 + seconds / 60 / 60;

    const distanceConfig = distance.find((d) => miles > d.min && miles < d.max);
    const durationConfig = duration.find(
      (d) => totalTime > d.min && hours < d.max
    );
    const weightConfig = weight.find(
      (w) => totalWeight > w.min && totalWeight < w.max
    );

    const stats: Achievement[] = [
      {
        type: 'distance',
        category: 'Traveler',
        level: distanceConfig?.level ?? 1,
        value: miles,
        nextLevel: distanceConfig?.max ?? 0,
        label: distanceConfig?.label ?? '',
      },
      {
        type: 'duration',
        category: 'Time Keeper',
        level: durationConfig?.level ?? 1,
        value: hours + minutes / 60 + seconds / 60 / 60,
        nextLevel: durationConfig?.max ?? 0,
        label: durationConfig?.label ?? '',
      },
      {
        type: 'weight',
        category: 'Trash Collector',
        level: weightConfig?.level ?? 1,
        value: totalWeight,
        nextLevel: weightConfig?.max ?? 0,
        label: weightConfig?.label ?? '',
      },
    ];

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error logging activity: ', error);
    return res.status(500).json({ error: 'Failed to log activity' });
  }
};
