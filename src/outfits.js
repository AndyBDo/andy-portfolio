export const outfits=[
  {name:'The Met tee + sweatpants',shirt:'#303033',pants:'#b7b8b9',jacket:false},
  {name:'Museum graphic tee + black jeans',shirt:'#e3e2d8',pants:'#292b2b',jacket:false},
  {name:'Butterfly zip-up + sweatpants',shirt:'#242424',pants:'#b7b8b9',jacket:true},
  {name:'Cornell sweatshirt + black pants',shirt:'#d6cbb4',pants:'#292b2b',jacket:false},
  {name:'Varsity jacket + white tee + light jeans',shirt:'#262429',pants:'#a9bec8',jacket:true},
  {name:'Navy overshirt + white tee + dark jeans',shirt:'#202c36',pants:'#333b40',jacket:true},
  {name:'Brown knit overshirt + white tee + light jeans',shirt:'#514a40',pants:'#a9bec8',jacket:true},
];
function script(c,lines,y,color,size=8){c.fillStyle=color;c.textAlign='center';c.textBaseline='middle';c.font=`italic ${size}px "Snell Roundhand", "Brush Script MT", cursive`;lines.forEach((line,i)=>c.fillText(line,32,y+i*(size+3),55));}
function butterfly(c,x,y,scale){
  c.save();c.translate(x,y);c.scale(scale,scale);c.fillStyle='#c7ba83';
  for(const sign of[-1,1]){c.save();c.scale(sign,1);c.beginPath();c.moveTo(0,0);c.lineTo(5,-7);c.lineTo(15,-8);c.lineTo(18,-4);c.lineTo(14,1);c.lineTo(8,3);c.lineTo(13,8);c.lineTo(8,12);c.lineTo(3,8);c.closePath();c.fill();c.fillStyle='#26282a';c.fillRect(9,-5,4,3);c.fillRect(6,5,3,3);c.restore();}
  c.fillStyle='#958b64';c.fillRect(-1,-5,2,14);c.restore();
}
export function paintOutfit(c,kind,face,index){
  if(index===0)return;
  const fit=outfits[index],w=c.canvas.width,h=c.canvas.height;
  if(index>=3){paintCollegeFit(c,kind,face,index);return;}
  if(kind==='shirt'){
    c.fillStyle=fit.shirt;c.fillRect(0,0,w,h);
    if(index!==2)for(let y=0;y<h;y+=8){c.fillStyle=y%24===0?'#0000000b':'#ffffff05';c.fillRect(0,y,w,8);}
    if(index===1){
      if(face===4){c.fillStyle='#bb875f';c.fillRect(24,0,16,8);c.fillStyle='#282725';c.font='6px Minecraft';c.textAlign='center';c.fillText('The Metropolitan',46,22,30);c.fillText('Museum of Art',46,28,30);}
      if(face===5){
        // Low-resolution interpretation of the reference's equestrian museum print.
        c.fillStyle='#5f5b4d';c.fillRect(8,13,48,54);c.fillStyle='#702f24';c.fillRect(10,16,15,20);c.fillRect(14,12,12,7);
        c.fillStyle='#b29d6b';c.fillRect(20,27,5,5);c.fillStyle='#443829';c.fillRect(24,33,5,21);
        c.fillStyle='#2c231a';c.fillRect(31,27,15,30);c.fillRect(29,23,11,9);c.fillRect(42,33,8,10);c.fillRect(29,52,5,12);c.fillRect(43,52,5,12);
        c.fillStyle='#aa8650';c.fillRect(33,33,11,3);c.fillRect(34,42,5,4);c.fillStyle='#c9b98d';c.fillRect(15,38,11,4);c.fillRect(25,48,9,5);
        c.fillStyle='#222';c.font='6px Minecraft';c.textAlign='center';c.fillText('The Metropolitan',32,76,53);c.fillText('Museum of Art',32,83,51);
      }
    }else{
      if(face===4){
        c.fillStyle='#090909';c.beginPath();c.moveTo(24,0);c.lineTo(40,0);c.lineTo(32,47);c.closePath();c.fill();
        c.strokeStyle='#5d5b53';c.lineWidth=1;c.beginPath();c.moveTo(24,0);c.lineTo(32,47);c.lineTo(40,0);c.stroke();c.fillStyle='#5d5b53';c.fillRect(31,47,2,49);c.fillStyle='#ad9d73';c.fillRect(31,45,3,5);
        script(c,['New York'],43,'#c7ba83',13);butterfly(c,48,21,.3);butterfly(c,16,58,.3);
        c.fillStyle='#343537';c.fillRect(4,67,23,2);c.fillRect(37,67,23,2);
      }
      if(face===5){
        c.fillStyle='#181818';c.fillRect(12,0,40,15);c.fillStyle='#303030';c.fillRect(16,0,32,10);
        butterfly(c,32,28,.65);script(c,['The Metropolitan','Museum of Art'],54,'#c7ba83',8);
      }
    }
    c.fillStyle=index===1?'#c7c7be':'#181818';c.fillRect(0,88,w,8);
  }
  if(kind==='arm'){
    const sleeve=fit.jacket?88:40;c.fillStyle=fit.shirt;c.fillRect(0,0,w,sleeve);c.fillStyle=fit.jacket?'#181818':'#c7c7be';c.fillRect(0,sleeve-8,w,8);

  }
  if(kind==='pants'&&index===1){
    c.fillStyle='#292b2b';c.fillRect(0,0,w,h);c.fillStyle='#343637';c.fillRect(8,8,8,68);c.fillStyle='#1c1e1f';c.fillRect(0,0,w,8);c.fillRect(0,80,w,8);c.fillStyle='#121415';c.fillRect(0,88,w,8);
    if(face===4){c.fillStyle='#747473';c.fillRect(2,2,2,2);c.fillStyle='#3b3d3c';c.fillRect(0,8,8,2);}
  }
}

function paintCollegeFit(c,kind,face,index){
  if(index===5){paintNavyFit(c,kind,face);return;}
  if(index===6){paintKnitFit(c,kind,face);return;}
  const varsity=index===4,w=c.canvas.width,h=c.canvas.height;
  const cream='#d6cbb4',ink='#29282c',white='#eeeae0';
  if(kind==='pants'){
    c.fillStyle=varsity?'#a9bec8':'#292b2b';c.fillRect(0,0,w,h);
    c.fillStyle=varsity?'#b9ccd3':'#383b3b';c.fillRect(8,8,8,70);
    c.fillStyle=varsity?'#899fa9':'#1c1e1f';c.fillRect(0,0,w,5);c.fillRect(0,80,w,8);
    if(face===4||face===5){c.fillStyle=varsity?'#d3d8ce':'#515250';c.fillRect(2,9,9,1);c.fillRect(2,10,1,6);c.fillRect(w-2,8,1,68);}
    c.fillStyle=varsity?'#e3ddd1':'#131516';c.fillRect(0,88,w,8);return;
  }
  if(kind==='arm'){
    c.fillStyle=cream;c.fillRect(0,0,w,88);c.fillStyle='#c8bca5';c.fillRect(0,8,6,68);
    c.fillStyle=cream;c.fillRect(0,78,w,10);c.fillStyle=ink;c.fillRect(0,79,w,2);c.fillRect(0,85,w,2);return;
  }
  if(kind!=='shirt')return;
  c.fillStyle=varsity?ink:cream;c.fillRect(0,0,w,h);
  c.fillStyle=varsity?'#ffffff08':'#00000009';for(let x=8;x<w;x+=16)c.fillRect(x,10,4,70);
  // Striped ribbed hem wraps all sides; the back remains blank on the Cornell crewneck.
  c.fillStyle=cream;c.fillRect(0,82,w,14);c.fillStyle=ink;c.fillRect(0,84,w,3);c.fillRect(0,91,w,3);
  if(face===4||face===5){
    c.fillStyle=cream;c.fillRect(17,0,30,6);c.fillStyle=ink;c.fillRect(20,1,24,1);c.fillRect(20,4,24,1);
  }
  if(!varsity&&face===4){
    c.fillStyle='#bb875f';c.fillRect(25,0,14,4);
    c.fillStyle=ink;c.textAlign='center';c.textBaseline='middle';c.font='9px Minecraft';
    [...'CORNELL'].forEach((letter,i)=>c.fillText(letter,9+i*7.5,29+Math.abs(i-3)*1.6));
    // Pixel crest: ring, shield, four quarters, and an open book.
    c.strokeStyle=ink;c.lineWidth=1;c.strokeRect(22,42,20,22);c.strokeRect(24,44,16,18);
    c.fillRect(31,45,1,15);c.fillRect(25,50,14,1);c.fillRect(26,46,3,2);c.fillRect(34,46,3,2);
    c.fillRect(26,54,4,5);c.fillRect(33,54,4,5);c.fillStyle=cream;c.fillRect(27,55,2,1);c.fillRect(34,55,2,1);
  }
  if(varsity&&face===4){
    // Open varsity jacket reveals the plain white undershirt.
    c.fillStyle=white;c.beginPath();c.moveTo(24,0);c.lineTo(40,0);c.lineTo(35,31);c.lineTo(35,83);c.lineTo(29,83);c.lineTo(29,31);c.closePath();c.fill();
    c.fillStyle='#151417';c.fillRect(24,8,3,74);c.fillRect(37,8,3,74);
    c.fillStyle='#c7bfae';for(let y=17;y<80;y+=17){c.fillRect(22,y,2,2);c.fillRect(40,y,2,2);}
    c.fillStyle=cream;c.textAlign='center';c.font='italic 12px "Snell Roundhand", cursive';c.fillText('SH',48,28,20);
    c.font='5px Minecraft';c.fillText('SOHO@W1F/LDN',14,29,21);
    c.fillStyle='#65615b';c.fillRect(6,64,15,1);c.fillRect(43,64,15,1);
  }
  if(varsity&&face===5){script(c,['Soho Heights'],31,cream,12);c.font='6px Minecraft';c.fillStyle=cream;c.textAlign='center';c.fillText('@W1F',32,45);}
}

function paintNavyFit(c,kind,face){
  const w=c.canvas.width,h=c.canvas.height,navy='#202c36';
  if(kind==='shirt'){
    c.fillStyle=navy;c.fillRect(0,0,w,h);c.fillStyle='#293944';c.fillRect(5,14,6,65);c.fillRect(49,20,5,61);
    c.fillStyle='#17232c';c.fillRect(0,88,w,8);
    if(face===4){
      c.fillStyle='#e0dfd7';c.beginPath();c.moveTo(22,0);c.lineTo(42,0);c.lineTo(39,20);c.lineTo(39,90);c.lineTo(25,90);c.lineTo(25,20);c.closePath();c.fill();
      c.fillStyle='#bb875f';c.fillRect(26,0,12,6);
      c.fillStyle='#17242d';c.fillRect(20,12,4,76);c.fillRect(40,12,4,76);
      c.fillStyle='#52616a';c.fillRect(16,0,6,12);c.fillRect(42,0,6,12);
      c.fillStyle='#bcbcb2';for(let y=18;y<85;y+=16)c.fillRect(21,y,2,2);
      c.fillStyle='#979b9b';c.fillRect(27,9,1,9);c.fillRect(37,9,1,9);c.fillRect(28,18,9,1);c.fillRect(32,19,1,9);c.fillRect(30,22,5,1);
    }
    if(face===5){c.fillStyle='#2e3b45';c.fillRect(0,12,w,2);c.fillRect(30,14,3,66);}
  }
  if(kind==='arm'){
    c.fillStyle=navy;c.fillRect(0,0,w,66);c.fillStyle='#33434e';c.fillRect(0,58,w,10);c.fillStyle='#18262f';c.fillRect(0,66,w,2);
  }
  if(kind==='pants'){
    c.fillStyle='#333b40';c.fillRect(0,0,w,h);c.fillStyle='#414b50';c.fillRect(8,12,8,62);c.fillStyle='#242d33';c.fillRect(0,0,w,7);c.fillRect(w-3,10,2,70);
    c.fillStyle='#4e5759';c.fillRect(0,82,w,5);c.fillStyle='#96754d';c.fillRect(0,88,w,8);c.fillStyle='#4a3e2e';c.fillRect(0,94,w,2);
    if(face===4){c.fillStyle='#687073';c.fillRect(2,9,8,1);}
  }
}

function paintKnitFit(c,kind,face){
  if(kind==='pants'){paintCollegeFit(c,kind,face,4);return;}
  const w=c.canvas.width,h=c.canvas.height;
  if(kind!=='shirt'&&kind!=='arm')return;
  const sleeveBottom=kind==='arm'?44:h;
  c.fillStyle='#514a40';c.fillRect(0,0,w,sleeveBottom);
  // Broad pixel ribs and eyelets keep the knit chunky at player scale.
  for(let x=0;x<w;x+=8){
    c.fillStyle='#635a4d';c.fillRect(x,8,3,sleeveBottom-16);
    c.fillStyle='#3a352f';c.fillRect(x+6,8,2,sleeveBottom-16);
    for(let y=8;y<sleeveBottom-10;y+=12){
      c.fillStyle='#2f2b26';c.fillRect(x+3,y,3,3);
      c.fillStyle='#786c5a';c.fillRect(x+3,y+3,3,2);
    }
  }
  c.fillStyle='#453f36';c.fillRect(0,sleeveBottom-7,w,7);
  c.fillStyle='#655c4d';for(let x=1;x<w;x+=3)c.fillRect(x,sleeveBottom-6,1,5);
  if(kind==='shirt'&&face===4){
    c.fillStyle='#eeece3';c.beginPath();c.moveTo(24,0);c.lineTo(40,0);c.lineTo(37,28);c.lineTo(37,88);c.lineTo(27,88);c.lineTo(27,28);c.closePath();c.fill();
    c.fillStyle='#bb875f';c.fillRect(27,0,10,5);
    c.fillStyle='#433d34';c.fillRect(22,14,4,74);c.fillRect(38,14,4,74);
    c.fillStyle='#726653';c.beginPath();c.moveTo(15,0);c.lineTo(26,0);c.lineTo(30,17);c.lineTo(21,12);c.closePath();c.fill();
    c.beginPath();c.moveTo(38,0);c.lineTo(49,0);c.lineTo(43,12);c.lineTo(34,17);c.closePath();c.fill();
    for(let y=22;y<86;y+=17){c.fillStyle='#a59b7d';c.fillRect(22,y,3,3);c.fillStyle='#403c32';c.fillRect(23,y+1,1,1);}
  }
  if(kind==='shirt'&&face===5){c.fillStyle='#453f36';c.fillRect(19,0,26,5);}
}

export function finishClothing(c){
  const w=c.canvas.width,h=c.canvas.height;
  const image=c.getImageData(0,0,w,h),data=image.data;
  // Flatten low-contrast fabric into a regular grid while preserving sharp print edges.
  for(let y=0;y<h;y+=4)for(let x=0;x<w;x+=4){
    const lo=[255,255,255],hi=[0,0,0],sum=[0,0,0];let count=0;
    for(let dy=0;dy<4&&y+dy<h;dy++)for(let dx=0;dx<4&&x+dx<w;dx++){
      const i=((y+dy)*w+x+dx)*4;count++;
      for(let ch=0;ch<3;ch++){lo[ch]=Math.min(lo[ch],data[i+ch]);hi[ch]=Math.max(hi[ch],data[i+ch]);sum[ch]+=data[i+ch];}
    }
    if(hi.some((v,ch)=>v-lo[ch]>24))continue;
    const rgb=sum.map(value=>Math.round(value/count/8)*8);
    for(let dy=0;dy<4&&y+dy<h;dy++)for(let dx=0;dx<4&&x+dx<w;dx++){
      const i=((y+dy)*w+x+dx)*4;for(let ch=0;ch<3;ch++)data[i+ch]=rgb[ch];
    }
  }
  c.putImageData(image,0,0);
}
