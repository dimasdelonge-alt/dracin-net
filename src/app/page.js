// src/app/page.js
import Link from "next/link";

// 1. Fungsi ambil data Kategori (Yang Lama)
async function getDramas() {
  const url = "https://api.sansekai.my.id/api/netshort/theaters";
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1 jam
    if (!res.ok) throw new Error("Gagal ambil data theaters");
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// 2. Fungsi ambil data FOR YOU (Fitur Baru)
async function getForYou() {
  const url = "https://api.sansekai.my.id/api/netshort/foryou";
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Gagal ambil data For You");
    const json = await res.json();
    // Datanya ada di dalam property 'contentInfos' sesuai JSON yang kamu kirim
    return json.contentInfos || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  // Panggil kedua API secara bersamaan
  const categoriesData = getDramas();
  const forYouData = getForYou();

  // Tunggu keduanya selesai
  const [categories, forYouList] = await Promise.all([categoriesData, forYouData]);

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8 py-4">
        <div className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-8 h-8 md:w-12 md:h-12 object-cover rounded-full border-2 border-red-600" 
          />
          <h1 className="text-lg md:text-2xl font-bold text-red-600 tracking-tighter leading-none">
            Nuno <span className="text-white">Drama</span>
          </h1>
        </div>
        
        <div className="flex gap-2 items-center">
          <Link 
            href="/search" 
            className="flex items-center justify-center bg-gray-800 text-white border border-gray-700 rounded-full w-8 h-8 md:w-auto md:h-auto md:px-4 md:py-2 hover:bg-gray-700 transition"
          >
            <span className="text-sm md:text-lg">🔍</span>
            <span className="hidden md:inline-block ml-2 text-sm font-semibold">Cari</span>
          </Link>
          <button className="bg-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-sm font-bold shadow-lg shadow-red-900/40">
            VIP
          </button>
        </div>
      </header>

      {/* --- BAGIAN BARU: FOR YOU --- */}
      {forYouList.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✨</span>
            <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
              Rekomendasi Spesial
            </h2>
          </div>

          {/* Kita buat scroll menyamping (Horizontal) biar beda dari yang lain */}
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {forYouList.map((film) => (
              <Link 
                href={`/play/${film.shortPlayId}`} 
                key={film.shortPlayId} 
                className="group min-w-[140px] md:min-w-[180px] cursor-pointer relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-gray-800 shadow-lg shadow-yellow-900/10">
                  <img 
                    src={film.shortPlayCover} 
                    alt={film.shortPlayName}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Label 'BARU' kalau ada di JSON */}
                  {film.scriptName && (
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">
                      {film.scriptName}
                    </div>
                  )}
                </div>
                
                <h3 className="mt-2 text-sm font-bold text-white line-clamp-2 group-hover:text-yellow-400 transition">
                  {film.shortPlayName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  🔥 {film.heatScoreShow || "Hot"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* --- BAGIAN LAMA: KATEGORI LAINNYA --- */}
      {categories.map((kategori, index) => (
        <section key={index} className="mb-10">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-200 border-l-4 border-red-600 pl-3">
            {kategori.contentName}
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {kategori.contentInfos?.map((film) => (
              <Link 
                href={`/play/${film.shortPlayId}`} 
                key={film.shortPlayId} 
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-2 bg-gray-900">
                  <img 
                    src={film.shortPlayCover} 
                    alt={film.shortPlayName}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 right-1 bg-black/60 px-1 rounded text-[10px] font-bold text-white border border-white/20">
                    HD
                  </div>
                </div>

                <h3 className="text-xs font-semibold text-gray-300 line-clamp-2 leading-tight group-hover:text-white transition">
                  {film.shortPlayName}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      ))}

    </div>
  );
}