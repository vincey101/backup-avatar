// This layout will include your sidebar
import Sidebar from "@/components/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed">
        <Sidebar />
      </div>
      <div className="flex-1 ml-[280px]">
        <main className="p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
} 