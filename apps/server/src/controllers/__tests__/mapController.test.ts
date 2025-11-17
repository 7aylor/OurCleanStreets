import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOrsDirections, getOrsGeocode } from '../../utils/ors';
import { getRoute, getRoutesByZipcode, search } from '../mapController';
import { getPrismaClient } from '../../utils/prisma';
// @ts-ignore
import polyline from '@mapbox/polyline';

vi.mock('../../utils/prisma', () => ({
  getPrismaClient: vi.fn(),
}));

vi.mock('../../utils/ors', () => ({
  getOrsDirections: vi.fn(),
  getOrsGeocode: vi.fn(),
}));

vi.mock('@mapbox/polyline', () => ({
  default: {
    decode: vi.fn(),
  },
}));

const mockReq = (body: any) => ({ body } as any);
const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('getRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns decoded route, distance, duration', async () => {
    const req = mockReq({
      coordinates: [
        [12.3, -45.6],
        [12.4, -45.7],
      ],
    });
    const res = mockRes();

    (getOrsDirections as any).mockReturnValue({
      calculate: vi.fn().mockResolvedValue({
        routes: [
          {
            geometry: 'POLYLINE123',
            summary: { distance: 1200, duration: 300 },
          },
        ],
      }),
    });

    (polyline.decode as any).mockReturnValue([
      [12.3, -45.6],
      [12.4, -45.7],
    ]);

    await getRoute(req, res);

    expect(res.json).toHaveBeenCalledWith({
      distance: 1200,
      duration: 300,
      coordinates: [
        [12.3, -45.6],
        [12.4, -45.7],
      ],
    });
  });

  it('returns 500 if an error is thrown', async () => {
    const req: any = { body: { coordinates: [[40, -70]] } };
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    (getOrsDirections as any).mockReturnValue({
      calculate: vi.fn().mockRejectedValue(new Error('ORS failure')),
    });

    const consoleSpy = vi.spyOn(console, 'error');

    await getRoute(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error.' });
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('getRoutesByZipcode', () => {
  const prismaMock = {
    cleanUpRoute: {
      findMany: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getPrismaClient as any).mockReturnValue(prismaMock);
  });

  it('returns 400 for invalid zipcode schema', async () => {
    const req = mockReq({ zipcode: '' });
    const res = mockRes();

    await getRoutesByZipcode(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  it('returns 404 when no routes found', async () => {
    prismaMock.cleanUpRoute.findMany.mockResolvedValue([]);

    const req = mockReq({ zipcode: '12345' });
    const res = mockRes();

    await getRoutesByZipcode(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No routes found for this zipcode.',
    });
  });

  it('returns formatted routes when found', async () => {
    prismaMock.cleanUpRoute.findMany.mockResolvedValue([
      {
        id: 'route1',
        zipcode: '12345',
        coordinates: [[12.3, 45.6]],
        distance: 100,
        duration: 50,
        createdAt: new Date(),
        activity: {
          activityDate: new Date('2025-01-01'),
          trashWeight: 10,
          user: { id: 'user1' },
        },
      },
    ]);

    const req = mockReq({ zipcode: '12345' });
    const res = mockRes();

    await getRoutesByZipcode(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({
        userId: 'user1',
        trashWeight: 10,
        activityDate: new Date('2025-01-01'),
      }),
    ]);
  });

  it('returns 500 if an exception is thrown', async () => {
    const req: any = { body: { zipcode: '12345' } };
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const prismaMock = {
      cleanUpRoute: {
        findMany: vi.fn().mockRejectedValue(new Error('DB failure')),
      },
    };
    (getPrismaClient as any).mockReturnValue(prismaMock);

    const consoleSpy = vi.spyOn(console, 'error');

    await getRoutesByZipcode(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error.' });
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching routes by zipcode:',
      expect.any(Error)
    );
  });
});

describe('search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns formatted geocode search results', async () => {
    const req = mockReq({ text: 'ASU' });
    const res = mockRes();

    (getOrsGeocode as any).mockReturnValue({
      geocode: vi.fn().mockResolvedValue({
        features: [
          {
            geometry: { coordinates: [-12.3, 45.6] }, // lon, lat
            properties: {
              country: 'USA',
              label: 'Tempe, AZ',
            },
          },
        ],
      }),
    });

    await search(req, res);

    expect(res.json).toHaveBeenCalledWith({
      matches: [
        {
          address: 'Tempe, AZ',
          coordinates: [45.6, -12.3], // flipped
          country: 'USA',
        },
      ],
    });
  });

  it('returns 500 if an exception is thrown', async () => {
    const req: any = { body: { text: 'ASU' } };
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    (getOrsGeocode as any).mockReturnValue({
      geocode: vi.fn().mockRejectedValue(new Error('Geocode failure')),
    });

    const consoleSpy = vi.spyOn(console, 'error');

    await search(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error.' });
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
  });
});
