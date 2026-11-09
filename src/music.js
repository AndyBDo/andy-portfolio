import covers from './assets/favorite-music.webp';
const songs=[
  {title:'TELEKINESIS',artist:'Travis Scott',cover:'74 70 424 414'},
  {title:'Yuusha',artist:'YOASOBI',cover:'555 70 428 414'},
  {title:'ID',artist:'keshi',cover:'1040 70 425 414'},
  {title:'Bruch Violin Concerto',artist:'Hilary Hahn',cover:'285 530 439 434'},
  {title:'Black Swan',artist:'BTS',cover:'818 530 438 434'},
];
export function favoriteMusic(){
  const outline='M10 2H90V6H94V11H98V89H94V94H90V98H10V94H6V89H2V11H6V6H10Z';
  return `<section class="favorite-music" aria-labelledby="favorite-music-title"><h2 id="favorite-music-title">Favorite music</h2><div class="music-grid">${songs.map((song,index)=>`<figure class="music-card"><svg class="album-cover" viewBox="0 0 100 100" role="img" aria-label="${song.title} album artwork"><defs><clipPath id="album-${index}"><path d="${outline}"/></clipPath></defs><g clip-path="url(#album-${index})"><svg width="100" height="100" viewBox="${song.cover}" preserveAspectRatio="none"><image href="${covers}" width="1536" height="1024"/></svg></g><path class="album-outline" d="${outline}" fill="none" stroke="#000" stroke-width="3" stroke-linejoin="miter"/></svg><figcaption><h3>${song.title}</h3><p>${song.artist}</p></figcaption></figure>`).join('')}</div></section>`;
}
