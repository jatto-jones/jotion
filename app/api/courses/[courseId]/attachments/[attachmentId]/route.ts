import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, {params}: {params: {attachmentId: string, courseId: string}}) {
    const {attachmentId, courseId} = params
    const {userId} = auth()

    if(!userId) return new NextResponse('Unauthorized', {status: 401})

    try {
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        })

        if(!courseOwner) return new NextResponse('Unauthorized', {status: 401})

        const attachment = await db.attachment.delete({
            where: {
                courseId: courseId,
                id: attachmentId
            }
        })

        return NextResponse.json(attachment)
    } catch {
        return new NextResponse('Internal Error', {status: 500})
    }
}