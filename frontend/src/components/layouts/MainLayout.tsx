import { Outlet } from "react-router-dom"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { CartModal } from "@/components/ui"


export const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 mt-[80px]">
                <Outlet />
            </main>
            <Footer />
            <CartModal />
        </div>
    )
}
