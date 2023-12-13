import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, {params}: {params: {courseId: string}}) {

    const {courseId} = params
    const {userId} = auth()

    if(!userId) {
        return new NextResponse("Unauthorized", {status: 401})
    }
    
    try {
        const {url} = await req.json()

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        })

        if(!courseOwner) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split('/').pop(),
                courseId
            }
        })

        return NextResponse.json(attachment)
    } catch (error) {
        return new NextResponse("Internal Error", {status:500})
    }
}