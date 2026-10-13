'use strict';

// Published program descriptions; Sawyer is the source for live registration.
const classes = [
  {id:'baby',name:'Baby Moves',subtitle:'A first dance, together.',style:'combo',min:0,max:2,age:'Babies & toddlers',duration:'45 minutes',description:'Parent-and-child movement, music and play.',placement:'Ask the studio about age suitability.'},
  {id:'combo34',name:'Combo · ages 3–4',subtitle:'Ballet · Tap · Tumbling',style:'combo',min:3,max:4,age:'Ages 3–4',duration:'60 minutes',description:'An introduction to three kinds of movement.'},
  {id:'combo45',name:'Combo · ages 4–5',subtitle:'Ballet · Tap · Tumbling',style:'combo',min:4,max:5,age:'Ages 4–5',duration:'60 minutes',description:'Build on the basics, one class at a time.'},
  {id:'combo57',name:'Combo · ages 5–7',subtitle:'Ballet · Tap · Tumbling',style:'combo',min:5,max:7,age:'Ages 5–7',duration:'60 minutes',description:'Keep exploring through a combination class.'},
  {id:'combo69',name:'Combo · ages 6–9',subtitle:'Ballet · Tap · Jazz',style:'combo',min:6,max:9,age:'Ages 6–9',duration:'75 minutes',description:'Three styles in one weekly class.'},
  {id:'combo811',name:'Combo · ages 8–11',subtitle:'Ballet · Tap · Jazz · Lyrical',style:'combo',min:8,max:11,age:'Ages 8–11',duration:'90 minutes',description:'Explore four styles and develop your range.'},
  {id:'pre-pointe',name:'Pre-pointe',subtitle:'Ballet foundations',style:'ballet',min:null,max:null,age:'By placement',duration:'Ask the studio',description:'Work toward pointe with individual skills assessments.'},
  {id:'pointe',name:'Pointe',subtitle:'Three levels of training',style:'ballet',min:null,max:null,age:'By placement',duration:'Ask the studio',description:'Placement is determined by instructors.'},
  {id:'introhiphop',name:'Intro to hip-hop',subtitle:'Start with the beat.',style:'hiphop',min:5,max:7,age:'Ages 5–7',duration:'45 minutes',description:'A first introduction to hip-hop.'},
  {id:'hiphop1',name:'Hip-hop 1',subtitle:'Find your groove.',style:'hiphop',min:7,max:10,age:'Ages 7–10',duration:'60 minutes',description:'Practice hip-hop movement and choreography.'},
  {id:'hiphop2',name:'Hip-hop 2',subtitle:'Bring your own energy.',style:'hiphop',min:10,max:13,age:'Ages 10–13',duration:'60 minutes',description:'Keep developing your hip-hop vocabulary.'},
  {id:'hiphop3',name:'Hip-hop 3',subtitle:'Teens and adults',style:'hiphop',min:14,max:99,age:'Ages 14+',duration:'60 minutes',description:'Adult dancers are welcome.'},
  {id:'adulttap',name:'Adult tap',subtitle:'Make a little noise.',style:'tap',min:18,max:99,age:'Adults',duration:'45 minutes',description:'All levels welcome.'},
  {id:'advanced',name:'Advanced dance',subtitle:'Jazz · Lyrical · Contemporary',style:'advanced',min:null,max:null,age:'By placement',duration:'Ask the studio',description:'Four advanced levels for dedicated dancers.'},
  {id:'theater',name:'Musical theater',subtitle:'A little Broadway energy.',style:'theater',min:null,max:null,age:'Ask the studio',duration:'60 minutes',description:'Broadway-style jazz, tap and stage presence.'},
  {id:'technique',name:'Leaps, turns & tricks',subtitle:'Time to take flight.',style:'technique',min:null,max:null,age:'Ask the studio',duration:'60 minutes',description:'Required for competition dancers.'}
];

const list = document.querySelector('#class-list');
const ageFilter = document.querySelector('#age-filter');
const styleFilter = document.querySelector('#style-filter');
const dialog = document.querySelector('#class-dialog');
const ranges = {'toddler':[0,2],'3-5':[3,5],'6-9':[6,9],'10-13':[10,13],'14-17':[14,17],'adult':[18,99]};

function matchesAge(item, value) {
  if (value === 'all') return true;
  // Unknown ages remain visible as placement options, never age recommendations.
  if (item.min === null) return value !== 'toddler' && value !== '3-5';
  const [min, max] = ranges[value];
  return item.min <= max && item.max >= min;
}

function renderClasses() {
  const shown = classes.filter(item => matchesAge(item,ageFilter.value) && (styleFilter.value === 'all' || item.style === styleFilter.value));
  list.replaceChildren();
  for (const item of shown) {
    const row = document.createElement('article');
    row.className = 'class-row';
    const number = String(classes.indexOf(item)+1).padStart(2,'0');
    row.innerHTML = `<span class="class-number" aria-hidden="true">${number}</span><div><h3 class="class-name">${item.name}</h3><p class="class-subtitle">${item.subtitle}</p></div><p class="class-age">${item.age}${item.min === null ? '<small>Confirm suitability</small>' : ''}</p><span class="class-duration">${item.duration}</span><button class="class-open" aria-label="Details for ${item.name}"><span aria-hidden="true">↗</span></button>`;
    row.querySelector('button').addEventListener('click', () => openClass(item));
    list.append(row);
  }
  const placement = shown.filter(item => item.min === null).length;
  document.querySelector('#results-count').textContent = `${shown.length} ${shown.length === 1 ? 'class' : 'classes'} to explore${placement && ageFilter.value !== 'all' ? ` · ${placement} require age/level confirmation` : ''}`;
  if (!shown.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = '<p>No listed classes match both filters. Try another style, or let us help you find a fit.</p><button class="button" type="button">Show all classes ↗</button>';
    empty.querySelector('button').addEventListener('click', () => {document.querySelector('#class-filters').reset(); ageFilter.focus();});
    list.append(empty);
  }
  const params = new URLSearchParams();
  if(ageFilter.value !== 'all') params.set('age',ageFilter.value);
  if(styleFilter.value !== 'all') params.set('style',styleFilter.value);
  // Keep filters shareable without storing visitor data.
  try {history.replaceState(null,'',`${location.pathname}${params.size ? '?' + params.toString() : ''}${location.hash}`);} catch (_) { /* Local file previews may not support history updates. */ }
}

let previousFocus;
function openClass(item) {
  previousFocus = document.activeElement;
  document.querySelector('#dialog-label').textContent = 'FIND YOUR FLOOR / ' + item.subtitle;
  document.querySelector('#dialog-title').textContent = item.name;
  document.querySelector('#dialog-description').textContent = item.description + (item.placement ? ' ' + item.placement : '');
  document.querySelector('#dialog-facts').innerHTML = `<div><strong>WHO IT’S FOR</strong>${item.age}</div><div><strong>CLASS LENGTH</strong>${item.duration}</div>`;
  dialog.showModal();
  document.body.classList.add('dialog-open');
  dialog.querySelector('.dialog-close').focus();
}
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {const r=dialog.getBoundingClientRect(); if(event.target===dialog && (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)) dialog.close();});
dialog.addEventListener('close', () => {document.body.classList.remove('dialog-open');previousFocus?.focus();});
document.querySelector('#class-filters').addEventListener('change', renderClasses);
document.querySelector('#class-filters').addEventListener('submit', event => event.preventDefault());
document.querySelector('#class-filters').addEventListener('reset', () => {requestAnimationFrame(renderClasses);});
document.querySelector('#show-adults').addEventListener('click', () => {
  ageFilter.value='adult'; styleFilter.value='all'; renderClasses();
  document.querySelector('#classes').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  ageFilter.focus({preventScroll:true});
});
const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
function closeMenu(){navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.querySelector('span').textContent='+';}
menuButton.addEventListener('click',()=>{const open=navigation.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.querySelector('span').textContent=open?'−':'+';});
navigation.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape' && navigation.classList.contains('open')){closeMenu();menuButton.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.header'))closeMenu();});
matchMedia('(min-width: 761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
document.querySelector('#year').textContent=new Date().getFullYear();
const savedFilters=new URLSearchParams(location.search);
for(const [key,select] of [['age',ageFilter],['style',styleFilter]]){const value=savedFilters.get(key);if([...select.options].some(option=>option.value===value))select.value=value;}
renderClasses();
