import { describe, it, beforeEach, vi, expect, Mock } from 'vitest';

import { convertDistance, getDurationParts } from '@ocs/library';
import { getPrismaClient } from '../../utils/prisma';
import { getOrsGeocode } from '../../utils/ors';
import {
  getUserActivities,
  getUserStats,
  logActivity,
} from '../activityController';
import { ACHIEVEMENT_CONFIG } from '../../config/achievements.config';
import { randomUUID } from 'crypto';

vi.mock('../../utils/ors');
vi.mock('@ocs/library');

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  refreshToken: {
    findUnique: vi.fn(),
    deleteMany: vi.fn(),
  },
};

vi.mock('../../utils/prisma', () => ({
  getPrismaClient: vi.fn(() => mockPrisma),
}));

describe('activityController', () => {
  let req: any;
  let res: any;
  let prismaMock: any;
  let geocodeMock: any;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    prismaMock = {
      activity: {
        findMany: vi.fn(),
        create: vi.fn(),
      },
      cleanUpRoute: {
        create: vi.fn(),
      },
    };

    geocodeMock = {
      reverseGeocode: vi.fn(),
    };

    (getPrismaClient as Mock).mockReturnValue(prismaMock);
    (getOrsGeocode as Mock).mockReturnValue(geocodeMock);

    vi.clearAllMocks();
  });

  describe('getUserActivities', () => {
    it('returns 400 if missing userId', async () => {
      req.body = {};

      await getUserActivities(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing or invalid fields.',
      });
    });

    it('returns user activities', async () => {
      req.body = { userId: '123' };
      prismaMock.activity.findMany.mockResolvedValue([{ id: 1 }]);

      await getUserActivities(req, res);

      expect(prismaMock.activity.findMany).toHaveBeenCalledWith({
        where: { userId: '123' },
        include: { cleanUpRoute: true },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ activities: [{ id: 1 }] });
    });

    it('handles internal errors', async () => {
      req.body = { userId: '123' };
      prismaMock.activity.findMany.mockRejectedValue(new Error('DB error'));

      await getUserActivities(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to get user activities',
      });
    });
  });

  describe('logActivity', () => {
    const validBody = {
      coordinates: [[40, -74]],
      userId: randomUUID(),
      activityDate: '2023-01-01',
      duration: 1000,
      distance: 500,
      mostCommonItem: 'cans',
      trashWeight: 2,
    };

    it('returns 400 for invalid schema', async () => {
      req.body = {};

      await logActivity(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it('logs activity successfully', async () => {
      req.body = validBody;

      geocodeMock.reverseGeocode.mockResolvedValue({
        features: [{ properties: { postalcode: '90210' } }],
      });

      prismaMock.cleanUpRoute.create.mockResolvedValue({ id: 'route1' });

      prismaMock.activity.create.mockResolvedValue({
        id: 'abc1234',
        cleanUpRoute: {},
      });

      await logActivity(req, res);

      expect(prismaMock.cleanUpRoute.create).toHaveBeenCalled();
      expect(prismaMock.activity.create).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Activity logged successfully' })
      );
    });

    it('handles internal errors', async () => {
      req.body = validBody;

      prismaMock.cleanUpRoute.create.mockRejectedValue(new Error('fail'));

      await logActivity(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to log activity',
      });
    });
  });

  describe('getUserStats', () => {
    it('returns 400 if userId missing', async () => {
      req.body = {};

      await getUserStats(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing or invalid fields.',
      });
    });

    it('returns correct stats', async () => {
      req.body = { userId: '123' };

      prismaMock.activity.findMany.mockResolvedValue([
        {
          trashWeight: 5,
          cleanUpRoute: { duration: 123, distance: 555 },
        },
      ]);

      (convertDistance as Mock).mockReturnValue(1); // 1 mile
      (getDurationParts as Mock).mockReturnValue({
        hours: 1,
        minutes: 0,
        seconds: 0,
      });

      // Redefine achievement config for test to be consistent
      ACHIEVEMENT_CONFIG.distance = [
        { min: 0, max: 5, level: 2, label: 'test_distance' },
      ];
      ACHIEVEMENT_CONFIG.duration = [
        { min: 0, max: 10, level: 3, label: 'test_timer' },
      ];
      ACHIEVEMENT_CONFIG.weight = [
        { min: 0, max: 25, level: 4, label: 'test_collector' },
      ];

      await getUserStats(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));

      const result = res.json.mock.calls[0][0];

      expect(result[0].type).toBe('distance');
      expect(result[0].level).toBe(2); // from config

      expect(result[2].value).toBe(5); // weight
    });

    it('handles internal errors', async () => {
      req.body = { userId: '123' };
      prismaMock.activity.findMany.mockRejectedValue(new Error('fail'));

      await getUserStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to log activity',
      });
    });
  });
});
