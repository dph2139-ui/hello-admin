'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useState, useEffect } from 'react'

// --- CHANGE THESE TWO FOR EACH PAGE ---
const TABLE_NAME = 'llm_prompt_chains';
const PAGE_TITLE = 'Prompt Chains';
// --------------------------------------

export default function AdminRead() {
    const [data, setData] = useState<any[]>([])
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.from(TABLE_NAME).select('*').limit(50)
            if (data) setData(data)
        }
        fetchData()
    }, [])

    return (
        <div className="p-10 text-black bg-white min-h-screen">
            <h1 className="text-2xl font-black mb-6 uppercase border-b-4 border-black">{PAGE_TITLE} (READ)</h1>
            <div className="bg-gray-50 p-4 border-2 border-black overflow-auto max-h-[70vh]">
                <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    )
}