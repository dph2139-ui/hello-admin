'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useState, useEffect } from 'react'

export default function ViewUsers() {
    const [profiles, setProfiles] = useState<any[]>([])
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    useEffect(() => {
        const fetchProfiles = async () => {
            const { data } = await supabase.from('profiles').select('*')
            if (data) setProfiles(data)
        }
        fetchProfiles()
    }, [])

    return (
        <div className="p-8 text-black bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-6 border-b pb-2" style={{ color: '#000000' }}>Admin: User Management</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-3" style={{ color: '#000000' }}>Email</th>
                    <th className="border p-3" style={{ color: '#000000' }}>Superadmin?</th>
                </tr>
                </thead>
                <tbody>
                {profiles.map((p) => (
                    <tr key={p.id}>
                        <td className="border p-3" style={{ color: '#000000' }}>{p.email || 'No Email'}</td>
                        <td className="border p-3 font-bold" style={{ color: p.is_superadmin ? 'green' : 'red' }}>
                            {p.is_superadmin ? 'TRUE' : 'FALSE'}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}