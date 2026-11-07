(function(){
 if(typeof gsap==='undefined')return;
 var N=30, tower=document.getElementById('tower');
 // stars + skyline
 var st=document.getElementById('stars'); for(var i=0;i<70;i++){var s=document.createElement('i');s.style.left=Math.random()*100+'%';s.style.top=Math.random()*55+'%';s.style.opacity=Math.random()*.6;st.appendChild(s)}
 function city(id,n,min,max){var c=document.getElementById(id),r=function(a){return a};for(var i=0;i<n;i++){var b=document.createElement('b');b.style.height=(min+Math.random()*(max-min))+'%';c.appendChild(b)}}
 city('city',46,12,70);city('cityFar',34,25,95);
 var strips=[];
 for(var i=0;i<N;i++){var d=document.createElement('div');d.className='strip';d.style.top=(i*100/N)+'%';d.style.height=(100/N+0.25)+'%';d.style.backgroundSize='100% '+(N*100)+'%';d.style.backgroundPosition='0 '+(i/(N-1)*100)+'%';tower.appendChild(d);strips.push(d)}
 // sparks
 var sp=document.getElementById('spark'),sparks=[];for(var k=0;k<26;k++){var e=document.createElement('i');e.style.left=(8+Math.random()*84)+'%';sp.appendChild(e);sparks.push(e)}
 var tl=gsap.timeline({paused:true,defaults:{ease:'power3.out'}});
 var per=0.085, T0=0.3;
 tl.fromTo('#rig',{rotationY:-38,rotationX:6,scale:.86,y:30},{rotationY:-7,rotationX:0,scale:1,y:0,duration:4.2,ease:'power2.inOut'},0);
 tl.fromTo('#halo',{opacity:0},{opacity:1,duration:3.4,ease:'sine.in'},.6);
 tl.set('#scan',{opacity:1},T0);
 tl.fromTo('#scan',{bottom:'0%'},{bottom:'100%',duration:(N-1)*per+.5,ease:'none'},T0);
 tl.to('#scan',{opacity:0,duration:.35},T0+(N-1)*per+.35);
 strips.forEach(function(el,i){
  var order=N-1-i, t=T0+order*per, side=(i%2?1:-1);
  tl.fromTo(el,{x:side*260,y:90,z:-520,rotationX:-62*side*-1,rotationZ:side*4,opacity:0,filter:'brightness(2.6) saturate(.4)'},
   {x:0,y:0,z:0,rotationX:0,rotationZ:0,opacity:1,filter:'brightness(1) saturate(1)',duration:.95,ease:'back.out(1.25)'},t);
  tl.fromTo(el,{'--g':1},{'--g':0,duration:.7,ease:'power1.out'},t+.35);
 });
 var tEnd=T0+(N-1)*per+1;
 sparks.forEach(function(e,i){var t=T0+(i/26)*(N-1)*per;tl.fromTo(e,{opacity:0,y:0,bottom:(i/26*92)+'%'},{opacity:1,y:-60-Math.random()*80,duration:.9,ease:'power1.out'},t).to(e,{opacity:0,duration:.5},t+.7)});
 var tD=tEnd+.1;
 var rg=document.getElementById('rig'),H=window.innerHeight,rh=rg.offsetHeight,bt=parseFloat(getComputedStyle(rg).bottom)||0;
 tl.to('#rig',{y:bt,scale:(H*1.02)/rh,duration:2.1,ease:'power3.inOut'},tD);
 tl.fromTo('#fade',{yPercent:100,opacity:.4},{yPercent:0,opacity:1,duration:1.6,ease:'power2.out'},tD+.7);
 tl.to('#scan,#halo',{opacity:0,duration:.4},tD);
 tl.fromTo('#eb',{opacity:0,x:-20},{opacity:1,x:0,duration:.8},tD+.7);
 tl.fromTo('h1 .ln>span',{yPercent:110},{yPercent:0,duration:1.1,stagger:.16,ease:'power4.out'},tD+.9);
 tl.fromTo(['#lede','#facts','#cta'],{opacity:0,y:22},{opacity:1,y:0,duration:.9,stagger:.14},tD+1.8);
 tl.fromTo('#rig',{filter:'brightness(1)'},{filter:'brightness(1.3)',duration:.35,yoyo:true,repeat:1,ease:'sine.inOut'},tEnd-.5);
 var D=tl.duration(), ctr=document.getElementById('ctr');
 tl.eventCallback('onUpdate',function(){var n=Math.min(N,Math.round(Math.max(0,tl.time()-T0)/per));ctr.textContent='PAV. '+String(n).padStart(2,'0')+' / '+N});
 var idle=null;
 tl.eventCallback('onComplete',function(){if(idle)return;idle=gsap.timeline({repeat:-1,yoyo:true,defaults:{ease:'sine.inOut'}});idle.to('#tower',{scale:1.035,y:-10,rotationY:1.6,rotationZ:.25,duration:5.5},0)});
 window.setP=function(p){tl.pause();tl.progress(p)};
 var q=new URLSearchParams(location.search).get('p');
 var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var started=false;function go(){if(started)return;started=true;if(rm)tl.progress(1);else tl.play()}
 if(q!==null) setP(parseFloat(q)); else if(document.body.classList.contains('is-ready'))go(); else {document.addEventListener('zn:ready',go);setTimeout(go,7500)}
})();
