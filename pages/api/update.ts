// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import requireAccess from '../../auth/require-access';

// import {NextApiRequest, NextApiResponse} from "next"

export default async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const { user_id, id, data } = req.body;

        const users = await requireAccess({ user_id, project_id: id, permit: "Update" })

        if (users.length === 0) {
            res.status(401).json({ msg: "YOU Are Not allowed to update this project" });
            return;
        }

        const updateUser = await prisma.project.update({
            where: { id },
            data,
        })
        res.status(200).json(updateUser)
    } catch (error) {
        console.log(error)
        res.status(400).json(error.toString())
    }

}
