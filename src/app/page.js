// src/app/page.js
import Link from "next/link"; // <--- JANGAN LUPA INI

async function getDramas() {
  const url = "https://api.sansekai.my.id/api/netshort/theaters";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Gagal ambil data");
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const categories = await getDramas();

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8 sticky top-0 z-50 bg-black/80 backdrop-blur-sm py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-red-600">DRACIN STREAM 🐉</h1>
        
        <div className="flex gap-3 items-center">
          {/* Tombol Search Baru */}
          <Link href="/search" className="text-gray-300 hover:text-white text-sm font-semibold border border-gray-700 px-3 py-1.5 rounded-full transition">
            🔍 Cari
          </Link>
          
          <button className="bg-red-600 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-red-900/40">
            VIP
          </button>
        </div>
      </header>

      {/* LOOPING KATEGORI */}
      {categories.map((kategori, index) => (
        <section key={index} className="mb-10">
          
          <h2 className="text-xl font-bold mb-4 text-yellow-400 border-l-4 border-red-500 pl-3">
            {kategori.contentName}
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {kategori.contentInfos?.map((film) => (
              <Link 
                href={`/play/${film.shortPlayId}`} 
                key={film.shortPlayId} 
                className="group cursor-pointer"
              >
                
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-2">
                  <img 
                    src={film.shortPlayCover} 
                    alt={film.shortPlayName}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-1 right-1 bg-black/60 px-1 rounded text-[10px] font-bold text-white border border-white/20">
                    HD
                  </div>
                </div>

                <h3 className="text-xs font-semibold text-gray-200 line-clamp-2 leading-tight">
                  {film.shortPlayName}
                </h3>
                
                <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                  <span>🔥 {film.heatScoreShow || "New"}</span>
                </div>

              </Link>
            ))}
          </div>

        </section>
      ))}
    </div>
  );
}