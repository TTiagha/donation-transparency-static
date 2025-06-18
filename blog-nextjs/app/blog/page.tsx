import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-10">Blog</h1>
        <div className="grid gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="bg-gray-800 p-6 rounded-lg">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold hover:text-teal-400">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-2 text-gray-400">{post.excerpt}</p>
              <time className="text-sm text-gray-500">{post.date}</time>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}