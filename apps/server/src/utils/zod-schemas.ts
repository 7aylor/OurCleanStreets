import z from 'zod';

export const passwordSchema = z
  .string()
  .min(12, { message: 'Password must be at least 12 characters long' })
  .max(64, { message: 'Password must be at most 64 characters long' })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, {
    message: 'Password must contain at least one special character',
  });

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: passwordSchema,
});

export const signupSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/[A-Za-z0-9._-]/, { message: 'Username must be alphanumeric' }),
  email: z.email('Invalid email address'),
  zipcode: z.string().regex(/^\d{5}(-\d{4})?$/),
  password: z
    .string()
    .min(12, { message: 'Password must be at least 12 characters long' })
    .max(64, { message: 'Password must be at most 64 characters long' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one special character',
    }),
});

export const logActivitySchema = z.object({
  userId: z.uuid('Invalid userId'),
  activityDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  duration: z.number().min(0, 'duration must be non-negative'),
  distance: z.number().min(0, 'distance must be non-negative'),
  mostCommonItem: z.string().optional(),
  trashWeight: z.number().optional(),
  coordinates: z
    .array(z.array(z.number()).length(2)) // [[lat,lng], [lat,lng]]
    .min(1, 'At least one coordinate is required'),
});

export const zipcodeSchema = z.object({
  zipcode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid US ZIP code format'),
});
