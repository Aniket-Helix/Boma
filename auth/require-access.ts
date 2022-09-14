import React from 'react'

import { Permit, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

interface AccessOptions{
    user_id: number,
    project_id?: number|undefined,
    permit?: Permit|undefined
}
// let a: {user_id: BigInt, project_id: BigInt|undefined, permit: Permit}
export default async function requireAccess({ user_id, project_id = undefined , permit }: AccessOptions) {

    if (!user_id) throw new Error("user_id null");

    return await prisma.access.findMany({
        where: { user_id, project_id, permit },
        include: {
            project: true,
        },
    });

}
