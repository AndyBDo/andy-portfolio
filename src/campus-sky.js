import * as T from 'three';

export function campusSky() {
  const material=new T.ShaderMaterial({
    side:T.BackSide,depthWrite:false,
    uniforms:{zenith:{value:new T.Color('#596b9b')},horizon:{value:new T.Color('#efb18b')},cloudLight:{value:new T.Color('#ffd4ad')},cloudShade:{value:new T.Color('#a983a0')},sunDirection:{value:new T.Vector3(-195,65,95).normalize()}},
    vertexShader:'varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:`
      uniform vec3 zenith,horizon,cloudLight,cloudShade,sunDirection;
      varying vec3 direction;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      float cloud(vec2 p){float n=0.,a=.5;for(int i=0;i<5;i++){n+=a*noise(p);p=p*2.03+vec2(9.2,3.1);a*=.5;}return n;}
      void main(){
        vec3 d=normalize(direction);float y=max(d.y,0.);
        vec3 color=mix(horizon,zenith,pow(y,.55));
        float alignment=max(dot(d,sunDirection),0.);
        float glow=pow(alignment,16.);color+=vec3(.55,.23,.075)*glow;
        color+=vec3(2.5,1.4,.55)*smoothstep(.9994,.9998,alignment);
        if(d.y>.015){
          vec2 p=d.xz/(d.y+.12)*3.4+vec2(7.1,2.8);
          float n=cloud(p),density=smoothstep(.49,.73,n);
          float light=smoothstep(.40,.72,cloud(p+vec2(-.15,-.12)));
          vec3 clouds=mix(cloudShade,cloudLight,light)+vec3(.08,.045,.025)*glow;
          color=mix(color,clouds,density*smoothstep(.015,.12,d.y)*.94);
        }
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const sky=new T.Mesh(new T.SphereGeometry(880,32,16),material);sky.renderOrder=-1;return sky;
}
