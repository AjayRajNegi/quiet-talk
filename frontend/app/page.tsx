import Members from "@/components/Members";

export default function Home() {
  return (
    <main className="bg-cyan-400 w-full min-h-screen flex items-center">
      <div className="max-w-7xl w-7xl mx-auto h-[90vh]  bg-black flex rounded-2xl p-5 gap-5 border-2 border-white/70">
        <div className="w-1/4 h-full rounded-xl border-2 border-white/70 p-2">
          <Members />
        </div>
        <div className="w-3/4 h-full rounded-2xl border-2 border-white/70">
          Chat
        </div>
      </div>
    </main>
  );
}
