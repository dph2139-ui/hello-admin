'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useState, useEffect, useCallback } from 'react'

export default function ImageManager() {
    const [images, setImages] = useState<any[]>([])
    const [uploading, setUploading] = useState(false)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fetchImages = useCallback(async () => {
        const { data } = await supabase.from('images').select('*').order('created_at', { ascending: false })
        if (data) setImages(data)
    }, [supabase])

    useEffect(() => { fetchImages() }, [fetchImages])

    // CREATE: Function to upload and register new image
    async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true)
            if (!event.target.files || event.target.files.length === 0) return
            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `admin-uploads/${fileName}`

            // 1. Upload to Supabase Storage Bucket
            const { error: uploadError } = await supabase.storage
                .from('images') // Ensure you have a bucket named 'images'
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath)

            // 3. Insert into 'images' table
            const { error: dbError } = await supabase.from('images').insert({
                url: publicUrl,
                storage_path: filePath
            })

            if (dbError) throw dbError
            await fetchImages()
            alert('Upload successful!')
        } catch (error: any) {
            alert(error.message)
        } finally {
            setUploading(false)
        }
    }

    // DELETE: Remove image from DB and Storage
    async function deleteImage(id: string, storagePath: string) {
        if (!confirm('Delete this image forever?')) return

        await supabase.storage.from('images').remove([storagePath])
        await supabase.from('images').delete().eq('id', id)
        await fetchImages()
    }

    return (
        <div className="p-10 text-black bg-white min-h-screen">
            <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-black">Image Management (CRUD)</h1>

            {/* UPLOAD SECTION */}
            <div className="mb-10 p-6 border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="font-bold uppercase mb-2">Upload New Image</h2>
                <input
                    type="file"
                    accept="image/*"
                    onChange={uploadImage}
                    disabled={uploading}
                    className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-sm file:font-black file:bg-white hover:file:bg-gray-100"
                />
                {uploading && <p className="mt-2 animate-bounce font-bold">UPLOADING...</p>}
            </div>

            {/* READ SECTION: Image Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {images.map((img) => (
                    <div key={img.id} className="border-2 border-black p-2 bg-gray-50 flex flex-col">
                        <img src={img.url} alt="Admin Preview" className="h-40 w-full object-cover border-2 border-black mb-2" />
                        <button
                            onClick={() => deleteImage(img.id, img.storage_path)}
                            className="mt-auto bg-red-600 text-white font-black text-xs py-2 hover:bg-black transition-colors"
                        >
                            DELETE
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}