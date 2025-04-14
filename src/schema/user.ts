import {z} from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        email: z.string().email('invalid email format'),
        userId: z.string().min(4)
    })
});

