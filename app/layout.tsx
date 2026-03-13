import Sidebar from '@/components/Sidebar';
import './globals.css';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className="flex bg-white text-black">
        <Sidebar />
        <main className="ml-64 w-full min-h-screen">
            {children}
        </main>
        </body>
        </html>
    );
}
