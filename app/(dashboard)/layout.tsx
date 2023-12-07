import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className='h-[80px] md:pl-56 inset-y-0 fixed w-full'>
        <Navbar />
      </div>
      <div className="hidden md:flex flex-col w-56 inset-y-0 z-50 h-full fixed">
        <Sidebar />
      </div>
      <main className="sm:pl-56 h-full pt-[80px]">{children}</main>
    </div>
  );
};

export default layout;
