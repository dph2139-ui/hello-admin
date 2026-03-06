'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useState, useEffect } from 'react'

export default function ManageImages() {
    const [images, setImages] = useState<any[]>([])
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    useEffect(() => {
        fetchImages()
    }, [])

    async function fetchImages() {
        const { data } = await supabase.from('images').select('*')
        if (data) setImages(data)
    }

    async function deleteImage(id: string) {
        const confirmDelete = confirm("Are you sure you want to delete this image?")
        if (!confirmDelete) return

        const { error } = await supabase.from('images').delete().eq('id', id)
        if (error) alert(error.message)
        else fetchImages() // Refresh list
    }

    return (
        <div className="p-8 text-black">
            <h1 className="text-2xl font-bold mb-6">Manage Images</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">Image ID</th>
                    <th className="border p-2">Preview</th>
                    <th className="border p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {images.map((img) => (
                    <tr key={img.id}>
                        <td className="border p-2 text-xs">{img.id}</td>
                        <td className="border p-2">
                            <img src={img.url} alt="Admin preview" className="h-10 w-10 object-cover" />
                        </td>
                        <td className="border p-2">
                            <button
                                onClick={() => deleteImage(img.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded font-bold"
                            >
                                DELETE
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}