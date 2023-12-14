import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PUT(req: Request, {params}: {params: {courseId: string}}) {
    
    const {courseId} = params
    const {userId} = auth()

    if(!userId) {
        return new NextResponse("Unauthorized", {status: 401})
    }

    try{
        const {list} = await req.json()

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if(!courseOwner) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        for(let item of list) {
            await db.chapter.update({
                where: {
                    id: item.id
                },
                data: {
                    position: item.position
                }
            })
        }
        return new NextResponse('Success', {status: 200})
    } catch {
        return new NextResponse('Internal error', {status: 500})
    }
}