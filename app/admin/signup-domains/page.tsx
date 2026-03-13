'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useState, useEffect } from 'react'

// --- CHANGE THESE THREE FOR EACH PAGE ---
const TABLE_NAME = 'allowed_signup_domains'; // e.g., 'llm_models', 'allowed_signup_domains'
const COLUMN_NAME = 'apex_domain';                    // e.g., 'model_name', 'domain'
const PAGE_TITLE = 'Allowed Domain';
// ----------------------------------------

export default function AdminCRUD() {
    const [items, setItems] = useState<any[]>([])
    const [inputValue, setInputValue] = useState('')
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    useEffect(() => { fetchItems() }, [])
    async function fetchItems() {
        const { data } = await supabase.from(TABLE_NAME).select('*')
        if (data) setItems(data)
    }

    async function handleAdd() {
        if (!inputValue) return
        await supabase.from(TABLE_NAME).insert({ [COLUMN_NAME]: inputValue })
        setInputValue(''); fetchItems()
    }

    async function handleDelete(id: string) {
        if (confirm("Confirm Delete?")) {
            await supabase.from(TABLE_NAME).delete().eq('id', id)
            fetchItems()
        }
    }

    return (
        <div className="p-10 text-black min-h-screen bg-white">
            <h1 className="text-2xl font-black mb-6 uppercase border-b-4 border-black">{PAGE_TITLE} (CRUD)</h1>
            <div className="mb-6 flex gap-2">
                <input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    className="border-2 border-black p-2 flex-grow"
                    placeholder={`Add new ${COLUMN_NAME}...`}
                />
                <button onClick={handleAdd} className="bg-black text-white px-6 font-bold hover:bg-green-500">ADD</button>
            </div>
            <table className="w-full border-2 border-black">
                <thead><tr className="bg-gray-100"><th className="border-2 border-black p-2 text-left">{COLUMN_NAME}</th><th className="border-2 border-black p-2">Actions</th></tr></thead>
                <tbody>
                {items.map(item => (
                    <tr key={item.id}>
                        <td className="border-2 border-black p-2">{item[COLUMN_NAME]}</td>
                        <td className="border-2 border-black p-2 text-center">
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 font-bold underline">DELETE</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}