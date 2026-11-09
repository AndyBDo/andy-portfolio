import {test} from 'node:test';
import assert from 'node:assert/strict';
import {VoxelModel} from '../src/voxel-model.js';
import {campusBuildings} from '../src/campus-buildings.js';

function surfaceArea(results) {
  let area=0;
  for(const {positions:p,indices:ix} of results)for(let i=0;i<ix.length;i+=3){
    const a=ix[i]*3,b=ix[i+1]*3,c=ix[i+2]*3;
    const u=[0,1,2].map(k=>p[b+k]-p[a+k]),v=[0,1,2].map(k=>p[c+k]-p[a+k]);
    area+=Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])/2;
  }
  return area;
}
test('overlapping building solids produce only the outer shell',()=>{
  const model=new VoxelModel();
  model.box('stone',0,0,0,2,2,2);model.box('stone',1,0,0,2,2,2);
  const result=model.build();
  assert.equal(surfaceArea(result),32);
  assert.equal(result[0].positions.length/3,24);
});
test('a different roof material does not add an internal face',()=>{
  const model=new VoxelModel();
  model.box('wall',0,0,0,2,2,2);model.box('roof',0,1,0,2,2,2);
  assert.equal(surfaceArea(model.build()),32);
});
test('carved windows expose their reveals and preserve outward winding',()=>{
  const model=new VoxelModel(1);model.box('wall',0,0,0,3,3,3);model.box(null,0,0,0,1,1,5);
  const result=model.build();assert.equal(surfaceArea(result),64);
  for(const {positions:p,normals:n,indices:ix} of result)for(let i=0;i<ix.length;i+=3){
    const a=ix[i]*3,b=ix[i+1]*3,c=ix[i+2]*3;
    const u=[0,1,2].map(k=>p[b+k]-p[a+k]),v=[0,1,2].map(k=>p[c+k]-p[a+k]);
    const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
    assert.ok(cross.reduce((sum,k,j)=>sum+k*n[a+j],0)>0);
  }
});
test('Sage Chapel doorway is backed by a continuous wall',()=>{
  let checked=false;
  campusBuildings((model,x,y,z,turn,name)=>{
    if(!name.includes('Sage Chapel'))return;
    const doors=model.boxes.filter(b=>b.material==='oak'&&b.max[1]<=8);
    assert.ok(doors.length);
    for(const door of doors)for(let y=door.min[1];y<door.max[1];y++)for(let z=door.min[2];z<door.max[2];z++){
      const x=door.max[0];
      const backing=model.boxes.findLast(b=>x>=b.min[0]&&x<b.max[0]&&y>=b.min[1]&&y<b.max[1]&&z>=b.min[2]&&z<b.max[2]);
      assert.ok(backing?.material,'Door must touch its wall rather than float in front');
    }
    checked=true;
  },()=>0);
  assert.ok(checked);
});
