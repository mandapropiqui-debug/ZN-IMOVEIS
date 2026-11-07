(function(){
 var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
 var tipo='',lugar='',WA='5586981818067';
 var NT={casa:'Casa',apartamento:'Apartamento',cobertura:'Cobertura',fazenda:'Fazenda ou sítio',terreno:'Terreno ou lote',lancamento:'Lançamento'};
 var NL={teresina:'Teresina',cajueiro:'Cajueiro da Praia',barra:'Barra Grande'};
 function bind(id,set){
  var box=document.getElementById(id); if(!box)return;
  box.addEventListener('click',function(e){
   var b=e.target.closest('.chip'); if(!b)return;
   $$('.chip',box).forEach(function(c){c.setAttribute('aria-pressed',c===b?'true':'false')});
   set(b.getAttribute('data-v'));
  });
 }
 bind('chipsTipo',function(v){tipo=v});
 bind('chipsLugar',function(v){lugar=v});
 function match(el){
  var t=(el.getAttribute('data-tipo')||'').split(' '),l=el.getAttribute('data-lugar')||'';
  return (!tipo||t.indexOf(tipo)>-1)&&(!lugar||l===lugar);
 }
 function apply(){
  var cards=$$('#gridVitrine .card'),n=0;
  cards.forEach(function(c){var ok=match(c);c.hidden=!ok;if(ok){n++;c.style.opacity=1;c.style.transform='none'}});
  var gg=document.getElementById('launchGG');
  if(gg){var ok=match(gg);gg.hidden=!ok;if(ok){gg.style.opacity=1;gg.style.transform='none'}}
  var active=!!(tipo||lugar);
  var f=document.getElementById('filtro'),ft=document.getElementById('filtroTxt');
  f.classList.toggle('is-on',active);
  var what=(tipo?NT[tipo]:'Imóveis')+(lugar?' em '+NL[lugar]:'');
  ft.innerHTML='Mostrando: <b>'+what+'</b> · '+n+(n===1?' opção':' opções');
  var v=document.getElementById('vazio'),empty=(n===0&&!(gg&&!gg.hidden));
  v.classList.toggle('is-on',empty);
  if(empty){
   document.getElementById('vazioT').textContent='Ainda não temos '+(tipo?NT[tipo].toLowerCase():'imóvel')+(lugar?' em '+NL[lugar]:'')+' na vitrine.';
   var msg='Olá! Vim pelo site da ZN Imóveis. Procuro '+(tipo?NT[tipo].toLowerCase():'um imóvel')+(lugar?' em '+NL[lugar]:'')+'.';
   document.getElementById('vazioBtn').href='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
  }
  if(window.ScrollTrigger){setTimeout(function(){ScrollTrigger.refresh()},60)}
 }
 var go=document.getElementById('buscaGo');
 if(go)go.addEventListener('click',function(){
  apply();
  var t=document.getElementById('imoveis');
  setTimeout(function(){t.scrollIntoView({behavior:'smooth',block:'start'})},80);
 });
 var lim=document.getElementById('filtroLimpar');
 if(lim)lim.addEventListener('click',function(){
  tipo='';lugar='';
  $$('#chipsTipo .chip,#chipsLugar .chip').forEach(function(c){c.setAttribute('aria-pressed',c.getAttribute('data-v')===''?'true':'false')});
  apply();
 });
})();
