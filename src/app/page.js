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
      {/* HEADER: Hapus 'sticky' biar ikut ke-scroll */}
      <header className="flex justify-between items-center mb-6 py-4">
        
        {/* BAGIAN KIRI: Logo */}
        <div className="flex items-center gap-2">
          {/* Logo kita batasi ukurannya */}
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full border-2 border-red-600" 
          />
          
          {/* Teks Judul: Di HP kita HIDDEN (sembunyikan), cuma muncul di Laptop (md:block) */}
          <h1 className="hidden md:block text-2xl font-bold text-red-600 tracking-tighter">
            Nuno Drama <span className="text-white">Netshort</span>
          </h1>
        </div>
        
        {/* BAGIAN KANAN: Tombol */}
        <div className="flex gap-2 items-center">
          {/* Tombol Search: Di HP cuma Ikon, Di Laptop ada tulisan 'Cari' */}
          <Link 
            href="/search" 
            className="flex items-center justify-center bg-gray-800 text-white border border-gray-700 rounded-full w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 hover:bg-gray-700 transition"
          >
            <span className="text-lg">🔍</span>
            <span className="hidden md:inline-block ml-2 text-sm font-semibold">Cari</span>
          </Link>
          
          <button className="bg-red-600 text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold shadow-lg shadow-red-900/40">
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