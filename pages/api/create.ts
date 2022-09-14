// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import requireAccess from '../../auth/require-access';

// import {NextApiRequest, NextApiResponse} from "next"

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }
    const { id } = req.query;
    const user_id = parseInt(id)
    const project = (req.body);
    const users = await requireAccess({ user_id,project_id:undefined, permit: "Create" })

    if (Object.keys(project).length === 0) {
        res.status(203).json({ leng: users.length }); return;
    }
    try {
        const savedUser = await prisma.project.create({
            data: {
                ...project,
                'Access':{
                //connect:{user_id}
                create: [
                    {
                    user_id,
                    permit:'Create'
                },
                    {
                    user_id,
                    permit:'Update'
                },
                    {
                    user_id,
                    permit:'Delete'
                },
                    {
                    user_id,
                    permit:'Read'
                },
            ]
            }}
        })
        res.status(200).json({ leng: users.length, savedUser })
    } catch (error) {
        res.status(400).json({ message: error.toString() })
    }

}
