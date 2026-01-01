// src/app/play/[id]/page.js
"use client"; // <--- Wajib ada biar bisa klik-klik episode

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PlayPage() {
  const params = useParams(); // Ambil ID dari URL
  const [data, setData] = useState(null); // Wadah data film
  const [activeEp, setActiveEp] = useState(null); // Wadah episode yg lagi diputar
  const [loading, setLoading] = useState(true);

  // 1. Ambil Data saat halaman dibuka
  useEffect(() => {
    async function fetchData() {
      if (!params.id) return;
      
      try {
        const url = `https://api.sansekai.my.id/api/netshort/allepisode?shortPlayId=${params.id}`;
        const res = await fetch(url);
        const json = await res.json();
        
        setData(json);
        
        // Langsung putar episode 1 kalau datanya ada
        if (json.shortPlayEpisodeInfos && json.shortPlayEpisodeInfos.length > 0) {
          setActiveEp(json.shortPlayEpisodeInfos[0]);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  if (loading) return <div className="text-white p-10">Sedang memuat bioskop...</div>;
  if (!data) return <div className="text-red-500 p-10">Film tidak ditemukan :(</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      
      {/* BAGIAN ATAS: VIDEO PLAYER */}
      <div className="w-full max-w-4xl mx-auto pt-4 px-4">
        {/* Tombol Kembali */}
        <Link href="/" className="inline-block mb-4 text-gray-400 hover:text-white">
          ← Kembali ke Home
        </Link>

        {/* LAYAR VIDEO */}
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
          {activeEp ? (
            <video 
              key={activeEp.playVoucher} // Supaya player refresh pas ganti episode
              controls 
              autoPlay 
              poster={activeEp.episodeCover}
              className="w-full h-full"
            >
              <source src={activeEp.playVoucher} type="video/mp4" />
              Browser kamu tidak dukung video ini.
            </video>
          ) : (
            <div className="flex items-center justify-center h-full">Pilih Episode</div>
          )}
        </div>

        {/* JUDUL & SINOPSIS */}
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-white">{data.shortPlayName}</h1>
          <div className="flex gap-2 mt-2">
            {data.shortPlayLabels?.map((tag, i) => (
              <span key={i} className="bg-red-900/50 text-red-200 px-2 py-1 rounded text-xs border border-red-800">
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            {data.shotIntroduce}
          </p>
        </div>
      </div>

      {/* BAGIAN BAWAH: DAFTAR EPISODE */}
      <div className="max-w-4xl mx-auto p-4 mt-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          📺 Daftar Episode <span className="text-sm font-normal text-gray-500">({data.totalEpisode} Eps)</span>
        </h2>
        
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {data.shortPlayEpisodeInfos?.map((ep) => (
            <button
              key={ep.episodeId}
              onClick={() => setActiveEp(ep)} // KLIK DISINI BUAT GANTI VIDEO
              className={`
                p-2 rounded text-center text-sm font-semibold transition
                ${activeEp?.episodeId === ep.episodeId 
                  ? "bg-red-600 text-white shadow-lg scale-105" // Gaya kalau lagi diputar
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"} // Gaya biasa
              `}
            >
              Eps {ep.episodeNo}
              {ep.isLock && <span className="ml-1">🔒</span>}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}