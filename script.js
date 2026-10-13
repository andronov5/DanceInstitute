'use strict';

// Navigation stays fully visible if JavaScript is unavailable.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');
const narrowScreen = matchMedia('(max-width: 820px)');
function setMenu(open) {
  navigation.hidden = narrowScreen.matches && !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span').textContent = open ? '−' : '+';
}
menuButton.hidden = false;
setMenu(!narrowScreen.matches);
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
narrowScreen.addEventListener('change', () => setMenu(!narrowScreen.matches));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && narrowScreen.matches && !navigation.hidden) {
    setMenu(false);
    menuButton.focus();
  }
});
for (const button of document.querySelectorAll('.subnav-toggle')) {
  const submenu = document.getElementById(button.getAttribute('aria-controls'));
  const setOpen = open => {
    submenu.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    button.querySelector('span').textContent = open ? '−' : '+';
  };
  button.hidden = false;
  setOpen(submenu.dataset.defaultOpen === 'true');
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
}
for (const year of document.querySelectorAll('[data-year]')) year.textContent = new Date().getFullYear();

const filters = document.querySelector('#class-filters');
if (filters) {
  const age = document.querySelector('#age-filter');
  const style = document.querySelector('#style-filter');
  const search = document.querySelector('#class-search');
  const items = [...document.querySelectorAll('.class-item')];
  const ranges = {'3-5':[3,5], '6-9':[6,9], '10-13':[10,13], '14-17':[14,17], adult:[18,99]};
  const normalize = value => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  function matchesAge(item) {
    if (age.value === 'all') return true;
    if (age.value === 'placement') return item.dataset.audience === 'placement';
    if (age.value === 'baby') return item.dataset.audience === 'baby';
    if (item.dataset.min === '') return false;
    const [min, max] = ranges[age.value];
    return Number(item.dataset.min) <= max && Number(item.dataset.max) >= min;
  }
  function applyFilters() {
    let visible = 0;
    const query = normalize(search.value);
    for (const item of items) {
      const matches = matchesAge(item) && (style.value === 'all' || item.dataset.styles.split(' ').includes(style.value)) && query.split(' ').every(word => normalize(item.dataset.search).includes(word));
      item.hidden = !matches;
      if (matches) visible++;
      else item.open = false;
    }
    document.querySelector('#results-count').textContent = `${visible} ${visible === 1 ? 'class' : 'classes'}`;
    document.querySelector('#no-results').hidden = visible !== 0;
    document.querySelector('.directory-head').hidden = visible === 0;
    document.querySelector('#placement-note').hidden = ['all','placement','baby'].includes(age.value);
    const params = new URLSearchParams(location.search);
    for (const [key,value] of [['age',age.value],['style',style.value],['q',search.value.trim()]]) {
      if (!value || value === 'all') params.delete(key); else params.set(key,value);
    }
    try { history.replaceState(null,'',`${location.pathname}${params.size ? '?' + params.toString() : ''}${location.hash}`); } catch (_) { /* file:// previews can restrict history. */ }
  }
  function restoreFilters() {
    const params = new URLSearchParams(location.search);
    for (const [key,select] of [['age',age],['style',style]]) {
      const value = params.get(key);
      select.value = [...select.options].some(option => option.value === value) ? value : 'all';
    }
    search.value = params.get('q') || '';
    applyFilters();
  }
  filters.hidden = false;
  filters.addEventListener('submit', event => event.preventDefault());
  filters.addEventListener('input', applyFilters);
  filters.addEventListener('change', applyFilters);
  filters.addEventListener('reset', () => requestAnimationFrame(applyFilters));
  document.querySelector('#clear-filters').addEventListener('click', () => {filters.reset(); search.focus();});
  window.addEventListener('popstate', restoreFilters);
  restoreFilters();
}
