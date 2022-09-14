// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from '@prisma/client'
import requireAccess from '../../auth/require-access';
const prisma = new PrismaClient()

import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }
    let getUser = {};
    try {
        const {id} = req.query;
        const user_id: number = parseInt(id.toString())
        const users = await requireAccess({user_id,})
        if (users.length > 0)
            getUser = await prisma.access.findMany({
                where: { user_id },
                include: {
                    project: true,
                },
            });
        res.status(200).json(getUser)
    } catch (error) {
        res.status(400).json({ message: error })
    }

}
