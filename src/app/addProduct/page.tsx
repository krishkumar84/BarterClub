import PostForm from "@/components/PostForm"
import { auth } from "@clerk/nextjs/server";

const CreatePost = () => {
  const { sessionClaims} = auth();
  const userId = sessionClaims?.userId as string
  const { userId:clerkId } : { userId: string | null } = auth();

  if (!clerkId) return null;

  return (
    <div className="px-10">
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="max-w-7xl lg:mx-auto p-5 md:px-10 xl:px-0 w-full font-bold text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] text-center sm:text-left">Create Post</h3>
      </section>

      <div className="wrapper my-8">
      <PostForm clerkId={clerkId} userId={userId ?? ""} type="Create" />
      </div>
    </div>
  )
}

export default CreatePost