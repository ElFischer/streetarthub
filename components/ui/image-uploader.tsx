"use client"

import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useDropzone } from "react-dropzone"

export type UploaderItem = {
    id: string
    // For existing images already uploaded
    url?: string
    width?: number
    height?: number
    // For new local images not yet uploaded
    file?: File
    preview?: string
}

export function ImageUploader({
    initialItems = [],
    maxFiles = 12,
    onChange
}: {
    initialItems?: { url: string; width?: number; height?: number }[]
    maxFiles?: number
    onChange?: (items: UploaderItem[]) => void
}) {
    const [items, setItems] = useState<UploaderItem[]>([])

    // Initialize from existing cover items
    useEffect(() => {
        const mapped: UploaderItem[] = (initialItems || []).map((c) => ({
            id: crypto.randomUUID(),
            url: c.url,
            width: c.width,
            height: c.height
        }))
        setItems(mapped)
    }, [initialItems])

    // Emit changes upward
    useEffect(() => {
        onChange?.(items)
    }, [items, onChange])

    // Ensure width/height are populated for all items (preview or url)
    useEffect(() => {
        items.forEach((item) => {
            if ((item.preview || item.url) && (!item.width || !item.height)) {
                const img = new Image()
                img.onload = () => {
                    setItems((prev) => prev.map((p) => p.id === item.id ? {
                        ...p,
                        width: img.naturalWidth,
                        height: img.naturalHeight
                    } : p))
                }
                img.src = item.preview || (item.url as string)
            }
        })
    }, [items])

    const onDrop = useCallback((accepted: File[]) => {
        const remainingSlots = Math.max(0, maxFiles - items.length)
        const nextFiles = accepted.slice(0, remainingSlots)
        const next: UploaderItem[] = nextFiles.map((file) => ({
            id: crypto.randomUUID(),
            file,
            preview: URL.createObjectURL(file)
        }))
        setItems((prev) => [...prev, ...next])
    }, [items.length, maxFiles])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: true
    })

    // Clean up object URLs
    useEffect(() => {
        return () => {
            items.forEach((i) => i.preview && URL.revokeObjectURL(i.preview))
        }
    }, [items])

    const canMoveUp = useCallback((idx: number) => idx > 0, [])
    const canMoveDown = useCallback((idx: number) => idx < items.length - 1, [items.length])

    const move = useCallback((from: number, to: number) => {
        setItems((prev) => {
            const next = prev.slice()
            const [moved] = next.splice(from, 1)
            next.splice(to, 0, moved)
            return next
        })
    }, [])

    const remove = useCallback((id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id))
    }, [])

    const hasItems = items.length > 0

    const gridTemplateColumns = useMemo(() => {
        return "repeat(auto-fill, minmax(160px, 1fr))"
    }, [])

    return (
        <div className="space-y-3">
            <div
                {...getRootProps({
                    className: `rounded-md border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${isDragActive ? "border-blue-500 bg-blue-50" : "border-muted"}`
                })}
            >
                <input {...getInputProps()} />
                <p className="text-sm text-muted-foreground">
                    Drag & Drop oder klicken, um Bilder auszuwählen{maxFiles ? ` (max. ${maxFiles})` : ""}
                </p>
            </div>

            {hasItems && (
                <div className="grid gap-3" style={{ gridTemplateColumns }}>
                    {items.map((item, idx) => (
                        <div key={item.id} className="relative group border rounded-md overflow-hidden">
                            {/* image */}
                            {item.url ? (
                                // existing remote image
                                <img src={item.url} alt="" className="block w-full h-auto object-cover" />
                            ) : (
                                // local preview
                                <img src={item.preview} alt="" className="block w-full h-auto object-cover" />
                            )}

                            {/* controls */}
                            <div className="absolute inset-x-0 top-0 p-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={() => remove(item.id)}
                                    className="px-2 py-1 text-xs rounded bg-white/80 hover:bg-white text-red-600"
                                >
                                    Entfernen
                                </button>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        disabled={!canMoveUp(idx)}
                                        onClick={() => move(idx, idx - 1)}
                                        className="px-2 py-1 text-xs rounded bg-white/80 hover:bg-white disabled:opacity-50"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!canMoveDown(idx)}
                                        onClick={() => move(idx, idx + 1)}
                                        className="px-2 py-1 text-xs rounded bg-white/80 hover:bg-white disabled:opacity-50"
                                    >
                                        ↓
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
