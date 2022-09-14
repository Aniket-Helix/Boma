// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from '@prisma/client'
import requireAccess from '../../auth/require-access';
const prisma = new PrismaClient()

import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const getUser = await prisma.project.findMany();
        res.status(200).json(getUser)
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error })
    }

}
