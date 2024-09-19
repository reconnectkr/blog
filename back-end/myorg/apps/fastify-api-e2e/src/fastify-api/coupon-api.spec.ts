import { User } from '@prisma/client';
import {
  CreateCouponRequest,
  ListCouponQueryString,
  UpdateCouponRequest,
} from '@reconnect/coupon-dto';
import {
  password,
  prisma,
  seedUser,
} from '@reconnect/prisma-repository-common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Decimal } from 'decimal.js';

describe('Coupon API', () => {
  let users: User[];
  let user: User;
  let token: { accessToken: string; refreshToken: string };
  let axiosInstance: AxiosInstance;

  beforeAll(async () => {
    await deleteTestFixtures();
    await createTestFixtures();
  });

  afterAll(async () => {
    await deleteTestFixtures();
  });

  async function createTestFixtures() {
    await seedUser(prisma);
    users = await prisma.user.findMany();
    user = users[0];

    await login(user);
  }

  async function deleteTestFixtures() {
    await prisma.coupon.deleteMany();
    await prisma.user.deleteMany();
  }

  async function login(user: User) {
    const response = await axios.post('/api/login', {
      username: user.username,
      password: password,
    });
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('accessToken');
    token = response.data;

    axiosInstance = axios.create({
      // baseURL: 'https://api.example.com', // API의 기본 URL
      // timeout: 10000, // 요청 타임아웃 (10초)
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터
    axiosInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers['Authorization'] = `Bearer ${token.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  const createdCouponIds: number[] = [];

  it('should create multiple coupons', async () => {
    const coupons: CreateCouponRequest[] = [
      {
        code: 'TEST10',
        issuedBy: users[0].id,
        issuedAt: new Date(),
        expiredAt: new Date(Date.now() + 86400000), // 1 day from now
        rate: new Decimal(0.1),
      },
      {
        code: 'TEST20',
        issuedBy: users[1].id,
        issuedAt: new Date(),
        expiredAt: new Date(Date.now() + 172800000), // 2 days from now
        price: new Decimal(20),
      },
      {
        code: 'TEST30',
        issuedBy: users[0].id,
        issuedAt: new Date(),
        expiredAt: new Date(Date.now() + 259200000), // 3 days from now
        rate: new Decimal(0.3),
      },
    ];

    for (const coupon of coupons) {
      const res = await axiosInstance.post('/api/coupon', coupon, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('id');
      expect(res.data.code).toBe(coupon.code);
      createdCouponIds.push(res.data.id);
    }

    expect(createdCouponIds.length).toBe(coupons.length);
  });

  it('should list all coupons', async () => {
    const res = await axiosInstance.get('/api/coupon');
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('items');
    expect(res.data.items.length).toBeGreaterThanOrEqual(
      createdCouponIds.length
    );
  });

  it('should filter coupons by issuedBy', async () => {
    const query: ListCouponQueryString = {
      filter: { issuedBy: 'admin' },
      page: 1,
      pageSize: 10,
    };
    const res = await axiosInstance.get('/api/coupon', { params: query });
    expect(res.status).toBe(200);
    expect(
      res.data.items.every(
        (coupon: { issuedBy: string }) => coupon.issuedBy === 'admin'
      )
    ).toBe(true);
  });

  it('should filter coupons by rate', async () => {
    const query: ListCouponQueryString = {
      filter: { rate: { gte: new Decimal(0.2) } },
      page: 1,
      pageSize: 10,
    };
    const res = await axiosInstance.get('/api/coupon', { params: query });
    expect(res.status).toBe(200);
    expect(
      res.data.items.every((coupon: { rate: Decimal.Value }) =>
        new Decimal(coupon.rate).gte(0.2)
      )
    ).toBe(true);
  });

  it('should sort coupons by expiredAt in descending order', async () => {
    const query: ListCouponQueryString = {
      orderBy: { expiredAt: 'desc' },
      page: 1,
      pageSize: 10,
    };
    const res = await axiosInstance.get('/api/coupon', { params: query });
    expect(res.status).toBe(200);
    const items = res.data.items;
    for (let i = 1; i < items.length; i++) {
      expect(new Date(items[i - 1].expiredAt).getTime()).toBeGreaterThanOrEqual(
        new Date(items[i].expiredAt).getTime()
      );
    }
  });

  it('should update a coupon', async () => {
    const updateData: UpdateCouponRequest = {
      retrievedAt: new Date(),
      retrievedBy: users[1].id,
    };
    const res = await axiosInstance.patch(
      `/api/coupon/${createdCouponIds[0]}`,
      updateData
    );
    expect(res.status).toBe(200);
    expect(res.data.id).toBe(createdCouponIds[0]);
    expect(res.data.retrievedAt).toBe(updateData.retrievedAt?.toISOString());
    expect(res.data.retrievedBy).toBe(updateData.retrievedBy);
  });

  it('should delete a coupon', async () => {
    const res = await axiosInstance.delete(
      `/api/coupon/${createdCouponIds[1]}`
    );
    expect(res.status).toBe(204);

    try {
      await axiosInstance.get(`/api/coupon/${createdCouponIds[1]}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        expect(error.response?.status).toBe(404);
      }
    }
  });

  it('should handle non-existent coupon', async () => {
    try {
      await axiosInstance.get('/api/coupon/999999');
    } catch (error) {
      if (error instanceof AxiosError) {
        expect(error.response?.status).toBe(404);
        expect(error.response?.data).toEqual({ message: 'Coupon not found' });
      }
    }
  });

  it('should handle invalid coupon creation', async () => {
    const invalidCoupon: Partial<CreateCouponRequest> = {
      code: 'INVALID',
      // Missing required fields
    };

    try {
      await axiosInstance.post('/api/coupon', invalidCoupon);
    } catch (error) {
      if (error instanceof AxiosError) {
        expect(error.response?.status).toBe(400);
      }
    }
  });

  it('should handle pagination', async () => {
    const query: ListCouponQueryString = {
      page: 1,
      pageSize: 2,
    };
    const res = await axiosInstance.get('/api/coupon', { params: query });
    expect(res.status).toBe(200);
    expect(res.data.items.length).toBeLessThanOrEqual(2);
  });

  it('should handle pagination correctly', async () => {
    // First, create enough coupons to test pagination
    const additionalCoupons: CreateCouponRequest[] = Array.from(
      { length: 10 },
      (_, i) => ({
        code: `PAGINATE${i}`,
        issuedBy: users[0].id,
        issuedAt: new Date(),
        expiredAt: new Date(Date.now() + 86400000 * (i + 1)),
        price: new Decimal(10 + i),
      })
    );

    for (const coupon of additionalCoupons) {
      const res = await axiosInstance.post('/api/coupon', coupon);
      expect(res.status).toBe(200);
    }

    // Test first page
    const firstPageQuery: ListCouponQueryString = {
      page: 1,
      pageSize: 5,
    };
    const firstPageRes = await axiosInstance.get('/api/coupon', {
      params: firstPageQuery,
    });
    expect(firstPageRes.status).toBe(200);
    expect(firstPageRes.data.items.length).toBe(5);

    // Test second page
    const secondPageQuery: ListCouponQueryString = {
      page: 2,
      pageSize: 5,
    };
    const secondPageRes = await axiosInstance.get('/api/coupon', {
      params: secondPageQuery,
    });
    expect(secondPageRes.status).toBe(200);
    expect(secondPageRes.data.items.length).toBe(5);

    // Ensure first and second page results are different
    const firstPageIds = new Set(
      firstPageRes.data.items.map((item: any) => item.id)
    );
    const secondPageIds = new Set(
      secondPageRes.data.items.map((item: any) => item.id)
    );
    expect(intersection(firstPageIds, secondPageIds).size).toBe(0);

    // Test last page with fewer items
    const lastPageQuery: ListCouponQueryString = {
      page: 3,
      pageSize: 5,
    };
    const lastPageRes = await axiosInstance.get('/api/coupon', {
      params: lastPageQuery,
    });
    expect(lastPageRes.status).toBe(200);
    expect(lastPageRes.data.items.length).toBeGreaterThan(0);
    expect(lastPageRes.data.items.length).toBeLessThan(5);

    // Test page beyond available data
    const beyondDataQuery: ListCouponQueryString = {
      page: 10,
      pageSize: 5,
    };
    const beyondDataRes = await axiosInstance.get('/api/coupon', {
      params: beyondDataQuery,
    });
    expect(beyondDataRes.status).toBe(200);
    expect(beyondDataRes.data.items.length).toBe(0);
  });

  // Helper function to find intersection of two sets
  function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const _intersection = new Set<T>();
    for (const elem of setB) {
      if (setA.has(elem)) {
        _intersection.add(elem);
      }
    }
    return _intersection;
  }
});
