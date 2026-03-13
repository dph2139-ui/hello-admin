'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useState, useEffect, useCallback } from 'react'

// Define a type to get rid of the "Unexpected any" error
interface HumorMix {
    id: number;
    humor_flavor_id: number;
    caption_count: number;
    created_datetime_utc: string;
}

export default function ManageHumorMix() {
    const [mixes, setMixes] = useState<HumorMix[]>([])
    const [loading, setLoading] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Use useCallback to fix the "cascading renders" and dependency errors
    const fetchMix = useCallback(async () => {
        const { data, error } = await supabase
            .from('humor_flavor_mix')
            .select('*')

        if (error) {
            console.error('Error fetching mix:', error)
        } else {
            setMixes(data || [])
        }
        setLoading(false)
    }, [supabase])

    useEffect(() => {
        fetchMix()
    }, [fetchMix])

    async function updateCaptionCount(id: number, newCount: number) {
        const { error } = await supabase
            .from('humor_flavor_mix')
            .update({ caption_count: newCount })
            .eq('id', id)

        if (error) {
            alert('Update failed: ' + error.message)
        } else {
            await fetchMix()
        }
    }

    if (loading) return <div className="p-10 text-black font-bold">LOADING DATA...</div>

    return (
        <div className="p-10 text-black bg-white min-h-screen">
            <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-black italic">
                Humor Flavor Mix
            </h1>

            <div className="grid gap-4">
                {mixes.map((item) => (
                    <div key={item.id} className="p-6 border-2 border-black flex justify-between items-center bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div>
                            <p className="text-xs font-black text-gray-400">FLAVOR ID: {item.humor_flavor_id}</p>
                            <p className="font-bold">Record: {item.id}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-xs font-black uppercase">Count:</label>
                            <input
                                type="number"
                                defaultValue={item.caption_count}
                                onBlur={(e) => updateCaptionCount(item.id, Number(e.target.value))}
                                className="w-24 border-2 border-black p-2 font-black text-center focus:bg-yellow-200"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <footer className="mt-10 text-xs italic text-gray-500">
                {"* Data saves automatically when you click away from the input field."}
            </footer>
        </div>
    )
}