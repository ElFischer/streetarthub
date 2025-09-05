'use client'

import CustomImageRenderer from '@/components/renderers/CustomImageRenderer'
import { FC } from 'react'
import dynamic from 'next/dynamic'

const Output = dynamic(
    async () => (await import('editorjs-react-renderer')).default,
    { ssr: false }
)

interface EditorOutputProps {
    content: any
}

const renderers = {
    image: CustomImageRenderer
}

const style = {
    paragraph: {
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
    },
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
    // Filter out custom metadata blocks from rendering
    const filteredContent = content ? {
        ...content,
        blocks: content.blocks?.filter((block: any) => {
            // Only show standard EditorJS blocks, hide custom metadata blocks
            const customBlocks = ['coverBlock', 'artistBlock', 'categoryBlock', 'metadataBlock', 'locationBlock'];
            return !customBlocks.includes(block.type);
        }) || []
    } : null;

    // Don't render anything if no standard blocks exist
    if (!filteredContent || !filteredContent.blocks || filteredContent.blocks.length === 0) {
        return null;
    }

    return (
        <Output
            style={style}
            className='text-sm'
            renderers={renderers}
            data={filteredContent}
        />
    )
}

export default EditorOutput