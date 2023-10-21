import Navbar from "./_components/Navbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen dark:bg-[#1f1f1f]">
        <Navbar />
      <main className="h-full pt-40 dark:bg-[#1f1f1f]">{children}</main>
    </div>
  );
};

export default layout;
