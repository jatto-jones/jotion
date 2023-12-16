import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Eye, LayoutDashboard, Video } from "lucide-react";
import { redirect } from "next/navigation";
import GoBack from "../../_components/GoBack";
import ChapterTitleForm from "./_components/ChapterTitleForm";
import ChapterDescriptionForm from "./_components/ChapterDescriptionForm";
import { ChapterAccessForm } from "./_components/ChapterAccessForm";
import { ChapterVideoForm } from "./_components/ChapterVideoForm";
import { Banner } from "@/components/ui/banner";
import { ChapterActions } from "./_components/ChapterActions";

const CourseId = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { chapterId, courseId } = params;
  const { userId } = auth();

  if (!userId) return redirect("/");

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) return redirect("/");

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
    {!chapter.isPublished && (
      <Banner
          variant='warning'
          label="This chapter is not published. It will not be visible in the course"
       />
    )}
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <GoBack />
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span className="text-sm text-slate-700">
                Complete all fields {completionText}
              </span>
            </div>
            <ChapterActions
              disabled={!isComplete}
              courseId={courseId}
              chapterId={chapterId}
              isPublished={chapter.isPublished}
             />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="tsxt-xl">Customize your chapter</h2>
            </div>
            <ChapterTitleForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
          <div>
            <div className="flex items-ceneter gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">Access Settings</h2>
            </div>
            <ChapterAccessForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Video} />
            <h2 className="text-xl">Add a video</h2>
          </div>
          <ChapterVideoForm
            initialData={chapter}
            courseId={courseId}
            chapterId={chapterId}
           />
        </div>
      </div>
    </div>
    </>
  );
};

export default CourseId;
