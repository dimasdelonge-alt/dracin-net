// src/app/search/page.js
"use client";

import { useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setHasSearched(true);
    setResults([]); 

    try {
      // Panggil API Search
      const res = await fetch(`https://api.sansekai.my.id/api/netshort/search?searchKeyword=${query}`);
      const json = await res.json();
      
      // Ambil datanya (jaga-jaga kalau dibungkus 'data')
      const listFilm = json.data || json; 
      
      if (Array.isArray(listFilm)) {
        setResults(listFilm);
      } else {
        setResults([]);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <Link href="/" className="text-gray-400 mb-6 inline-block hover:text-white">
        ← Kembali ke Home
      </Link>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6 text-center">Cari Drama 🔍</h1>

        {/* KOLOM INPUT */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-10">
          <input 
            type="text" 
            placeholder="Ketik judul... (misal: Cinta)" 
            className="flex-1 p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-red-600 px-6 py-4 rounded-lg font-bold hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "..." : "Cari"}
          </button>
        </form>

        {/* HASIL PENCARIAN */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((film) => (
            <Link 
              href={`/play/${film.shortPlayId}`} 
              key={film.shortPlayId} 
              className="group block bg-gray-900 rounded-lg overflow-hidden"
            >
              <div className="relative aspect-[3/4]">
                <img 
                  src={film.shortPlayCover} 
                  alt={film.shortPlayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-200 line-clamp-2">
                  {film.shortPlayName}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        
        {/* PESAN JIKA KOSONG */}
        {hasSearched && !loading && results.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Tidak ditemukan 🥺</p>
        )}
      </div>
    </div>
  );
}