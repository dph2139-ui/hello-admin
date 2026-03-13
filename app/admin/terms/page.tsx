'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useState, useEffect } from 'react'

export default function TermsManager() {
    const [terms, setTerms] = useState<any[]>([])
    const [newTerm, setNewTerm] = useState({ name: '', definition: '' })
    const [editingId, setEditingId] = useState<string | null>(null)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => { fetchTerms() }, [])

    async function fetchTerms() {
        const { data } = await supabase.from('terms').select('*').order('name')
        if (data) setTerms(data)
    }

    async function handleCreate() {
        if (!newTerm.name) return
        await supabase.from('terms').insert([newTerm])
        setNewTerm({ name: '', definition: '' })
        fetchTerms()
    }

    async function handleUpdate(id: string, name: string, definition: string) {
        await supabase.from('terms').update({ name, definition }).eq('id', id)
        setEditingId(null)
        fetchTerms()
    }

    async function handleDelete(id: string) {
        if (confirm("Delete this term?")) {
            await supabase.from('terms').delete().eq('id', id)
            fetchTerms()
        }
    }

    return (
        <div className="p-10 text-black bg-white min-h-screen">
            <h1 className="text-3xl font-black mb-6 uppercase border-b-4 border-black">Manage Terms (CRUD)</h1>

            {/* CREATE SECTION */}
            <div className="mb-10 p-6 border-2 border-black bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="font-bold mb-4">Add New Term</h2>
                <div className="flex gap-4">
                    <input
                        placeholder="Term Name"
                        className="border-2 border-black p-2 w-1/3"
                        value={newTerm.name}
                        onChange={(e) => setNewTerm({...newTerm, name: e.target.value})}
                    />
                    <input
                        placeholder="Definition"
                        className="border-2 border-black p-2 w-full"
                        value={newTerm.definition}
                        onChange={(e) => setNewTerm({...newTerm, definition: e.target.value})}
                    />
                    <button onClick={handleCreate} className="bg-black text-white px-6 py-2 font-bold hover:bg-yellow-400 hover:text-black">ADD</button>
                </div>
            </div>

            {/* READ/UPDATE/DELETE TABLE */}
            <table className="w-full border-collapse border-2 border-black">
                <thead>
                <tr className="bg-black text-white">
                    <th className="p-3 border-2 border-black">Term</th>
                    <th className="p-3 border-2 border-black">Definition</th>
                    <th className="p-3 border-2 border-black">Actions</th>
                </tr>
                </thead>
                <tbody>
                {terms.map((t) => (
                    <tr key={t.id} className="hover:bg-yellow-50">
                        <td className="p-3 border-2 border-black font-bold">
                            {editingId === t.id ? (
                                <input className="border p-1 w-full" defaultValue={t.name} id={`name-${t.id}`} />
                            ) : t.name}
                        </td>
                        <td className="p-3 border-2 border-black">
                            {editingId === t.id ? (
                                <input className="border p-1 w-full" defaultValue={t.definition} id={`def-${t.id}`} />
                            ) : t.definition}
                        </td>
                        <td className="p-3 border-2 border-black flex gap-2">
                            {editingId === t.id ? (
                                <button
                                    onClick={() => handleUpdate(
                                        t.id,
                                        (document.getElementById(`name-${t.id}`) as HTMLInputElement).value,
                                        (document.getElementById(`def-${t.id}`) as HTMLInputElement).value
                                    )}
                                    className="bg-green-500 text-white px-2 py-1 text-xs font-bold"
                                >SAVE</button>
                            ) : (
                                <button onClick={() => setEditingId(t.id)} className="bg-blue-500 text-white px-2 py-1 text-xs font-bold">EDIT</button>
                            )}
                            <button onClick={() => handleDelete(t.id)} className="bg-red-500 text-white px-2 py-1 text-xs font-bold">DELETE</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}