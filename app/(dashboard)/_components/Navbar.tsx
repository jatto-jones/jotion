import { getAuthSession } from "@/lib/auth"
import MobileSidebar from "./MobileSidebar"
import UserAccountNav from "@/components/UserAccountNav"
import NavbarRoutes from "@/components/NavbarRoutes"

const Navbar = () => {

  return (
    <div className='h-full border-b flex items-center shadow p-4 bg-white'>
        <MobileSidebar />
        <NavbarRoutes />

    </div>
  )
}

export default Navbar