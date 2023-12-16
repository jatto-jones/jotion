import MobileSidebar from "./MobileSidebar"
import NavbarRoutes from "@/components/NavbarRoutes"

const Navbar = () => {

  return (
    <div className='z-50 absolute h-full border-b flex items-center shadow p-4 bg-white'>
        <MobileSidebar />
        <NavbarRoutes />
    </div>
  )
}

export default Navbar