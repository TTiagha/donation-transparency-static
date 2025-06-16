import { getPostBySlug, getAllPosts } from '@/lib/blog'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)

  return (
    <article className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <time className="text-gray-400">{post.date}</time>
        <div 
          className="mt-10 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  )
}