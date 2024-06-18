import{s as z,e as A,l as B,c as C,a as R,d as h,m as V,A as G,i as M,n as _,z as H,B as v}from"../chunks/scheduler.BmPgHBB7.js";import{S as q,i as L,c as I,b as j,m as X,a as Y,t as Z,d as J}from"../chunks/index.BAVD_YBS.js";import{T as K,c as N,W as O,S as Q,C as U,A as $,D as y,M as b,B as ee,b as te,d as ne,P as ae}from"../chunks/Threlte.R4TUbG2m.js";import{w as P}from"../chunks/index.BUIbomYk.js";function se(i){let t,s;return t=new K({props:{scene:i[0],camera:i[1],renderer:i[2]}}),{c(){I(t.$$.fragment)},l(e){j(t.$$.fragment,e)},m(e,n){X(t,e,n),s=!0},p(e,[n]){const a={};n&1&&(a.scene=e[0]),n&2&&(a.camera=e[1]),n&4&&(a.renderer=e[2]),t.$set(a)},i(e){s||(Y(t.$$.fragment,e),s=!0)},o(e){Z(t.$$.fragment,e),s=!1},d(e){J(t,e)}}}function ie(i,t,s){let{scene:e}=t,{camera:n}=t,{renderer:a}=t;const l=N({colorSpace:a.outputColorSpace,toneMapping:a.toneMapping,dpr:a.getPixelRatio(),userSize:P({width:0,height:0}),parentSize:P({width:0,height:0}),renderMode:"always",autoRender:!1,shadows:!1,useLegacyLights:!1,colorManagementEnabled:!0});let p=0;const u=o=>{requestAnimationFrame(u),p+=o,l.scheduler.run(p)};return requestAnimationFrame(u),i.$$set=o=>{"scene"in o&&s(0,e=o.scene),"camera"in o&&s(1,n=o.camera),"renderer"in o&&s(2,a=o.renderer)},[e,n,a]}class re extends q{constructor(t){super(),L(this,t,ie,se,z,{scene:0,camera:1,renderer:2})}}const oe=(i,t)=>{const s=new re({target:i,props:t});return()=>{s.$destroy()}},ce=["#10121c","#2c1e31","#6b2643","#ac2847","#ec273f","#94493a","#de5d3a","#e98537","#f3a833","#4d3533","#6e4c30","#a26d3f","#ce9248","#dab163","#e8d282","#f7f3b7","#1e4044","#006554","#26854c","#5ab552","#9de64e","#008b8b","#62a477","#a6cb96","#d3eed3","#3e3b65","#3859b3","#3388de","#36c5f4","#6dead6","#5e5b8c","#8c78a5","#b0a7b8","#deceed","#9a4d76","#c878af","#cc99ff","#fa6e79","#ffa2ac","#ffd1d5","#f6e8e0","#ffffff"];function de(i){let t,s,e;return{c(){t=A("div"),s=B(),e=A("div"),this.h()},l(n){t=C(n,"DIV",{}),R(t).forEach(h),s=V(n),e=C(n,"DIV",{style:!0}),R(e).forEach(h),this.h()},h(){G(e,"display","contents")},m(n,a){M(n,t,a),i[2](t),M(n,s,a),M(n,e,a),i[3](e)},p:_,i:_,o:_,d(n){n&&(h(t),h(s),h(e)),i[2](null),i[3](null)}}}const le=27;function me(i,t,s){let e,n;const a=new O;a.shadowMap.enabled=!0,a.setPixelRatio(window.devicePixelRatio);const l=new Q;l.background=new U("#222");const p=new $(void 0,.3);l.add(p);const u=new y;u.intensity=.5,u.position.set(0,3,0),u.castShadow=!0;const o=new y;o.intensity=.5,o.position.set(0,3,2),o.castShadow=!0;const w=new y;w.intensity=.5,w.position.set(2,1,2),w.castShadow=!0,l.add(u,o,w);const T=new b().makeRotationX(.005).multiply(new b().makeRotationY(.005)).multiply(new b().makeRotationZ(.005)),g=new b,S=[];let f=0;const x=(r,c)=>{const d=r%3*c-c,F=Math.trunc(r%9/3)*c-c,W=Math.trunc(r/9)*c-c;g.makeTranslation(d,F,W)};for(;f<le;){const r=new ee,c=new te({color:ce[f]}),d=new ne(r,c);d.name=`Cube ${f}`,d.castShadow=!0,d.receiveShadow=!0,S.push(d),l.add(d),x(f,1),d.applyMatrix4(g),f+=1}let k=0;const m=new ae(30);m.zoom=.9,m.position.set(10,10,10),m.lookAt(0,0,0),l.add(m),requestAnimationFrame(function r(){requestAnimationFrame(r),k+=.05,m.applyMatrix4(T);for(const[c,d]of S.entries())x(c,Math.sin(k/2)*.01),d.applyMatrix4(g);m.aspect=window.innerWidth/window.innerHeight,m.updateProjectionMatrix(),a.setSize(window.innerWidth,window.innerHeight),a.render(l,m)}),H(()=>{const r=oe(n,{renderer:a,scene:l,camera:m});return e.append(a.domElement),()=>{r()}});function D(r){v[r?"unshift":"push"](()=>{n=r,s(1,n)})}function E(r){v[r?"unshift":"push"](()=>{e=r,s(0,e)})}return[e,n,D,E]}class we extends q{constructor(t){super(),L(this,t,me,de,z,{})}}export{we as component};
