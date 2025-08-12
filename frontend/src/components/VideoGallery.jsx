import React, { useMemo, useState } from "react";

const YT = ({ id, title, preferred }) => (
  <div className="video-card" style={{border:'1px solid #e6e9f2', borderRadius:12, padding:10}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
      <strong>{title}</strong>
      {preferred && <span style={{fontSize:12, background:'#fde68a', padding:'2px 8px', borderRadius:999}}>🌟 Preferred</span>}
    </div>
    <div className="yt-wrap" style={{position:'relative', paddingBottom:'56.25%', height:0, overflow:'hidden', borderRadius:8}}>
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{position:'absolute', inset:0, width:'100%', height:'100%'}}
      />
    </div>
  </div>
);

export default function VideoGallery() {
  const myVideos = [
    { id:'dQw4w9WgXcQ', title:'VayoMitra: Shanti Katha', preferred:true },
    { id:'ysz5S6PUM-U', title:'Guided Breathing (3 min)', preferred:true },
  ];
  const recommended = [
    { id:'QHbtNAyH3gU', title:'Meditation Music 10m' },
    { id:'2OEL4P1Rz04', title:'Gujarati Lok Katha' },
  ];

  const all = useMemo(()=>[...myVideos, ...recommended], []);
  const [watched, setWatched] = useState(() => JSON.parse(localStorage.getItem('watchedVideos')||'[]'));

  const markWatched = (id) => {
    const set = new Set(watched);
    set.add(id);
    const arr = Array.from(set);
    setWatched(arr);
    localStorage.setItem('watchedVideos', JSON.stringify(arr));
  };

  return (
    <div className="feature-section" id="videos">
      <h2>🎥 VayoMitra Videos</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(2, minmax(0,1fr))', gap:12}}>
        {all.map(v => (
          <div key={v.id} onMouseLeave={()=>markWatched(v.id)} style={{opacity: watched.includes(v.id) ? 0.85 : 1}}>
            <YT id={v.id} title={v.title} preferred={!!v.preferred} />
          </div>
        ))}
      </div>
    </div>
  );
}