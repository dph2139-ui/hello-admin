'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useState, useEffect } from 'react'

export default function ReadCaptions() {
    const [captions, setCaptions] = useState<any[]>([])
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchCaptions = async () => {
            // Fetching all rows from sidechat_posts to fulfill the READ requirement
            const { data } = await supabase.from('sidechat_posts').select('*')
            if (data) setCaptions(data)
        }
        fetchCaptions()
    }, [])

    return (
        <div className="p-8 bg-white min-h-screen">
            <h1 className="text-2xl font-black mb-6 border-b-2 border-black pb-2 text-black">
                Admin: Caption Logs (READ-ONLY)
            </h1>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-black">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="border-2 border-black p-3 text-black">ID</th>
                        <th className="border-2 border-black p-3 text-black">Caption Content</th>
                        <th className="border-2 border-black p-3 text-black">Created At</th>
                    </tr>
                    </thead>
                    <tbody>
                    {captions.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2 text-xs text-gray-500">{c.id}</td>
                            <td className="border border-gray-300 p-2 font-medium text-black">{c.content}</td>
                            <td className="border border-gray-300 p-2 text-sm text-gray-600">
                                {new Date(c.created_datetime_utc).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-8">
                <a href="/" className="text-blue-600 font-bold underline">← Back to Dashboard</a>
            </div>
        </div>
    )
}