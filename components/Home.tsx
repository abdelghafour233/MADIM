
import React, { useState, useEffect } from 'react';
import { Article, Settings } from '../types';
import AdUnit from './AdUnit.tsx';
import RewardsCenter from './RewardsCenter.tsx';
import { INITIAL_REWARDS } from '../constants.tsx';

interface HomeProps {
  posts: Article[];
  onPostClick: (p: Article) => void;
  settings: Settings;
}

const Home: React.FC<HomeProps> = ({ posts, onPostClick, settings }) => {
  const trendingPost = posts.find(p => p.isTrending) || posts[0];
  const otherPosts = posts.filter(p => p.id !== trendingPost?.id);

  return (
    <div className="pt-24 md:pt-32 space-y-12 md:space-y-20 animate-slide-up">
      {/* Hero Banner */}
      <section 
        className="relative glass-card rounded-[35px] md:rounded-[50px] overflow-hidden cursor-pointer group"
        onClick={() => onPostClick(trendingPost)}
      >
        <div className="flex flex-col md:flex-row items-center">
           <div className="w-full md:w-1/2 p-8 md:p-16 space-y-6">
              <span className="inline-block bg-orange-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse">همزة اليوم 🔥</span>
              <h1 className="text-3xl md:text-6xl font-black leading-tight">{trendingPost.title}</h1>
              <p className="text-slate-400 text-lg line-clamp-2">{trendingPost.excerpt}</p>
              <div className="flex items-center gap-4 pt-4">
                 <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-xl shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                    اكتشف الآن 🛒
                 </div>
                 {trendingPost.marketPrice && (
                    <span className="text-slate-500 line-through font-bold">{trendingPost.marketPrice} د.م</span>
                 )}
              </div>
           </div>
           <div className="w-full md:w-1/2 p-8 flex justify-center bg-white/5">
              <img src={trendingPost.image} className="max-h-[300px] md:max-h-[450px] object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" alt="" />
           </div>
        </div>
      </section>

      {/* Rewards Section */}
      <RewardsCenter rewards={INITIAL_REWARDS} settings={settings} darkMode={true} />

      {/* Grid Section */}
      <div className="space-y-8 px-2">
        <h2 className="text-2xl md:text-4xl font-black flex items-center gap-3">
          <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
          أحدث الهميزات المكتشفة
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {otherPosts.map(post => (
            <div 
              key={post.id} 
              className="glass-card p-3 md:p-5 flex flex-col cursor-pointer rounded-[30px] group" 
              onClick={() => onPostClick(post)}
            >
              <div className="relative aspect-square rounded-[22px] overflow-hidden bg-white/5 mb-4 flex items-center justify-center">
                 <img src={post.image} className="w-[80%] h-[80%] object-contain group-hover:scale-110 transition-transform duration-500" alt="" />
                 <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-[8px] font-black text-emerald-500 uppercase">
                   {post.category}
                 </div>
              </div>
              <h3 className="text-sm md:text-lg font-black mb-4 line-clamp-2 h-10 md:h-14">{post.title}</h3>
              <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/5">
                 <span className="text-lg md:text-2xl font-black text-white">{post.price || 'همزة'} <small className="text-[10px] opacity-40">د.م</small></span>
                 <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                   🛒
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
    </div>
  );
};

export default Home;
