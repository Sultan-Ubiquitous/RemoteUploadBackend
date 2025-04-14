import { prismaGlobalClient } from "../prisma/prisma_client";

const prisma = prismaGlobalClient;

export async function createUser(userId: string, email: string) {

    try {
        const user = await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: {
                id: userId,
                email: email
            }
        });

        console.log('User: ', user);
        return user;

    } catch (error) {
    console.error('Error creating user:', error)
        throw error
    }
    
}