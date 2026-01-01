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
      // PERBAIKAN DISINI: Pakai parameter 'query' sesuai screenshot API
      const res = await fetch(`https://api.sansekai.my.id/api/netshort/search?query=${query}`);
      const json = await res.json();
      
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
      <Link href="/" className="text-gray-400 mb-6 inline-block hover:text-white transition">
        ← Kembali ke Home
      </Link>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6 text-center">Cari Drama 🔍</h1>

        <form onSubmit={handleSearch} className="flex gap-2 mb-10">
          <input 
            type="text" 
            placeholder="Ketik judul... (Contoh: Pewaris)" 
            className="flex-1 p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500 transition"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-red-600 px-6 py-4 rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/20"
            disabled={loading}
          >
            {loading ? "..." : "Cari"}
          </button>
        </form>

        {loading && <div className="text-center text-gray-500 animate-pulse">Sedang mencari di server...</div>}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((film) => (
            <Link 
              href={`/play/${film.shortPlayId}`} 
              key={film.shortPlayId} 
              className="group block bg-gray-900 rounded-lg overflow-hidden hover:ring-2 ring-red-500 transition"
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
        
        {hasSearched && !loading && results.length === 0 && (
          <div className="text-center py-10 bg-gray-900 rounded-xl border border-gray-800">
            <p className="text-xl text-gray-400">Drama tidak ditemukan 🥺</p>
            <p className="text-sm text-gray-600 mt-2">Coba kata kunci lain.</p>
          </div>
        )}
      </div>
    </div>
  );
}