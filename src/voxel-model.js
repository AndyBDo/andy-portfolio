// Paint solids onto one shared grid, then mesh only their exposed surfaces.
// Intersecting roofs and walls cannot leave duplicate coplanar faces.
export class VoxelModel {
  constructor(unit = .5) { this.unit = unit; this.boxes = []; }

  box(material, x, y, z, w, h, d) {
    if (![x,y,z,w,h,d].every(Number.isFinite) || Math.min(w,h,d) <= 0) throw new Error('Invalid campus solid');
    const min = [x-w/2,y-h/2,z-d/2].map(v => Math.round(v/this.unit));
    const max = [x+w/2,y+h/2,z+d/2].map((v,i) => Math.max(min[i]+1,Math.round(v/this.unit)));
    this.boxes.push({material,min,max});
  }

  build() {
    if (!this.boxes.length) return [];
    const min = [0,1,2].map(i => Math.min(...this.boxes.map(b=>b.min[i])));
    const max = [0,1,2].map(i => Math.max(...this.boxes.map(b=>b.max[i])));
    const size = max.map((n,i)=>n-min[i]);
    const names = [null,...new Set(this.boxes.map(b=>b.material).filter(Boolean))];
    const ids = new Map(names.map((name,i)=>[name,i]));
    const grid = new Uint16Array(size[0]*size[1]*size[2]);
    const index = (x,y,z)=>x+size[0]*(y+size[1]*z);
    for(const box of this.boxes) {
      const lo=box.min.map((v,i)=>v-min[i]), hi=box.max.map((v,i)=>v-min[i]);
      for(let z=lo[2];z<hi[2];z++)for(let y=lo[1];y<hi[1];y++) {
        grid.fill(ids.get(box.material) ?? 0,index(lo[0],y,z),index(hi[0],y,z));
      }
    }
    const results = names.map(material=>({material,positions:[],normals:[],uvs:[],indices:[]}));
    const sample = p => p.some((v,i)=>v<0||v>=size[i]) ? 0 : grid[index(...p)];
    for(let axis=0;axis<3;axis++) {
      const u=(axis+1)%3,v=(axis+2)%3;
      const mask=new Int32Array(size[u]*size[v]);
      for(let slice=0;slice<=size[axis];slice++) {
        const p=[0,0,0];p[axis]=slice;
        for(let j=0;j<size[v];j++)for(let i=0;i<size[u];i++) {
          p[u]=i;p[v]=j;p[axis]=slice-1;const a=sample(p);
          p[axis]=slice;const b=sample(p);
          mask[i+j*size[u]]=a&&!b?a:b&&!a?-b:0;
        }
        for(let j=0;j<size[v];j++)for(let i=0;i<size[u];) {
          const start=i+j*size[u],id=mask[start];
          if(!id){i++;continue;}
          let width=1,height=1;
          while(i+width<size[u]&&mask[start+width]===id)width++;
          outer:while(j+height<size[v]) {
            for(let k=0;k<width;k++)if(mask[start+height*size[u]+k]!==id)break outer;
            height++;
          }
          const out=results[Math.abs(id)],base=out.positions.length/3;
          for(const [du,dv] of [[0,0],[width,0],[width,height],[0,height]]) {
            const point=[...min],normal=[0,0,0];
            point[axis]+=slice;point[u]+=i+du;point[v]+=j+dv;
            out.positions.push(...point.map(n=>n*this.unit));normal[axis]=Math.sign(id);out.normals.push(...normal);
            out.uvs.push(du*this.unit,dv*this.unit);
          }
          out.indices.push(...(id>0?[0,1,2,0,2,3]:[0,2,1,0,3,2]).map(n=>n+base));
          for(let row=0;row<height;row++)mask.fill(0,start+row*size[u],start+row*size[u]+width);
          i+=width;
        }
      }
    }
    return results.slice(1).filter(result=>result.indices.length);
  }
}
