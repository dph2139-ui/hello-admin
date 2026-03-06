import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function AdminDashboard() {
    // Requirement: Await cookies for latest Next.js version
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
            },
        }
    )

// 1. LOGIN WALL: Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()

// FIX: Do NOT use redirect('/') here.
// Return a <div> instead to break the infinite loop.
    if (!user) {
        return (
            <div className="p-20 text-center bg-white min-h-screen text-black">
                <h1 className="text-3xl font-black mb-4">Authentication Required</h1>
                <p className="mb-8">Please log in to your account to access the admin staging area.</p>
                <a href="https://hello-nextjs-hfti3rpuc-dirk-harrisons-projects.vercel.app"
                   className="p-4 bg-blue-600 text-white font-bold rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
                    Log In via Main App
                </a>
            </div>
        )
    }

    // 2. SUPERADMIN CHECK: Only allow users with profiles.is_superadmin == TRUE
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_superadmin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_superadmin) {
        return (
            <div className="p-20 text-center bg-white min-h-screen text-black">
                <h1 className="text-red-600 font-black text-4xl mb-4">ACCESS DENIED</h1>
                <p className="text-xl">Your account does not have Superadmin privileges.</p>
                <p className="mt-4 text-gray-500 italic">Logged in as: {user.email}</p>
            </div>
        )
    }

    // 3. CREATIVE STATISTICS: Highlighting data for the assignment
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: imageCount } = await supabase.from('images').select('*', { count: 'exact', head: true })
    const { count: captionCount } = await supabase.from('sidechat_posts').select('*', { count: 'exact', head: true })

    return (
        <main className="p-8 bg-gray-50 min-h-screen text-black">
            <header className="mb-12 border-b-8 border-black pb-4">
                <h1 className="text-5xl font-black uppercase tracking-tighter">
                    Admin Command Center
                </h1>
                <p className="text-gray-600 font-bold mt-2">Authorized Staging Environment Only</p>
            </header>

            {/* SECTION: Interesting Statistics (Creative Requirement) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Total Profiles</h2>
                    <p className="text-6xl font-black">{userCount || 0}</p>
                </div>
                <div className="p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Images Stored</h2>
                    <p className="text-6xl font-black">{imageCount || 0}</p>
                </div>
                <div className="p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Captions Generated</h2>
                    <p className="text-6xl font-black">{captionCount || 0}</p>
                </div>
            </section>

            {/* SECTION: Management Routes */}
            <section>
                <h3 className="text-2xl font-black mb-6 underline decoration-4 decoration-yellow-400 uppercase">
                    Database Management
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link href="/admin/users"
                          className="p-6 bg-black text-white font-bold text-center border-2 border-black hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        MANAGE USERS (READ)
                    </Link>

                    <Link href="/admin/images"
                          className="p-6 bg-blue-600 text-white font-bold text-center border-2 border-black hover:bg-blue-700 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        MANAGE IMAGES (CRUD)
                    </Link>

                    <Link href="/admin/captions"
                          className="p-6 bg-green-600 text-white font-bold text-center border-2 border-black hover:bg-green-700 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        READ CAPTIONS
                    </Link>
                </div>
            </section>
        </main>
    )
}