import { prismaGlobalClient } from "../prisma/prisma_client";

import clerkClient from "@clerk/clerk-sdk-node";

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

export async function createOrganization(orgName: string, orgSlug: string, ownerId: string) {

    try {
        const organizationInClerk = await clerkClient.organizations.createOrganization({
            name: orgName,
            slug: orgSlug,
            createdBy: ownerId
        });
        console.log('Organization created in clerk');

        await prisma.organization.upsert({
            where: { ownerId: ownerId },
            update: {},
            create: {
                name: orgName,
                Slug: orgSlug,
                ownerId: ownerId
            }
        })

        console.log('Organization created ', organizationInClerk.id);
        return organizationInClerk.id;

    } catch (error) {
    console.error('Error creating Organization:', error)
        throw error
    }
        
}