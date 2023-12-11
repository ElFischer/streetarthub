import EditorOutput from '@/components/editor-output'
import Link from 'next/link';
import { Icons } from '../icons';

const ContentBlock = ({ post }: any) => {
  return (
    <div className="flex flex-col gap-4">
      <div className='flex justify-between items-center'>
        <div className='flex gap-2 text-blue-900 text-sm'>
          {post.category?.map((tag: any) => (
            <div key={tag}>
              <Link href={`/collections/${tag}`} title={`collection: ${tag}`}>
                #{tag}
              </Link>
            </div>
          ))}
          {post.artist?.map((tag: any) => (
            <div key={tag}>
              <Link href={`/artists/${tag}`} title={`artist: ${tag}`}>
                #{tag}
              </Link>
            </div>
          ))}
        </div>
        <div>
          {post.location?.country?.long_name ? (
            <Link
              href={'#'}
              /* href={`/places/${post.location.country.long_name}/${post.location.locality.long_name}`} */
              className="flex items-center space-x-2 text-xs font-bold text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Icons.map className="h-5 w-5" />
                <p>{`${post.location.country.long_name}, ${post.location.locality.long_name}`}</p>
              </div>
            </Link>
          ) : null}
        </div>
      </div>
      <div className='max-w-2xl flex flex-col gap-2'>
        <h1 className="inline-block font-heading text-3xl leading-tight lg:text-4xl">
          {post.title}
        </h1>
        {/* TODO: This is the Editor output with the cover image included. 
      Datastructure has to be changed, that images aren't displayed as cover image */}
        <EditorOutput content={post?.content} />
        <p>{post.description}</p>
      </div>
    </div>
  );
}

export default ContentBlock;