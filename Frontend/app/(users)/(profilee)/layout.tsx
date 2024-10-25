import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UserProfile from '@/components/User/userprofile'
import UserMain from '@/components/userMainII'
import Footer from "@/components/footer";


// import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "E-vent",
    description: "E-vent Event Management Company",
    icons: {
        icon: "/icon.jpg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>

                <UserMain />
                <UserProfile />
                {children}
                <Footer />

            </body>
        </html>
    );
}
