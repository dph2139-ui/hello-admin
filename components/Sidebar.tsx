import Link from 'next/link';

const navItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Images', href: '/admin/images' },
    { name: 'Humor Flavors', href: '/admin/humor-flavors' },
    { name: 'Humor Steps', href: '/admin/humor-steps' },
    { name: 'Humor Mix', href: '/admin/humor-mix' },
    { name: 'Terms', href: '/admin/terms' },
    { name: 'Captions', href: '/admin/captions' },
    { name: 'Caption Requests', href: '/admin/caption-requests' },
    { name: 'Caption Examples', href: '/admin/caption-examples' },
    { name: 'LLM Models', href: '/admin/models' },
    { name: 'LLM Providers', href: '/admin/providers' },
    { name: 'Prompt Chains', href: '/admin/prompt-chains' },
    { name: 'LLM Responses', href: '/admin/responses' },
    { name: 'Signup Domains', href: '/admin/signup-domains' },
    { name: 'Email Whitelist', href: '/admin/whitelist' },
];

export default function Sidebar() {
    return (
        <div className="w-64 bg-black text-white h-screen fixed left-0 top-0 overflow-y-auto p-6 border-r-4 border-yellow-400">
            <h2 className="text-xl font-black mb-8 border-b-2 border-yellow-400 pb-2">ADMIN CMS</h2>
            <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="text-sm font-bold hover:bg-yellow-400 hover:text-black p-2 transition-all uppercase"
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
}