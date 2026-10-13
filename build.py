"""Generate the complete static website. Run: python build.py (standard library only)."""
import json, re, html, hashlib
from pathlib import Path
ROOT = Path(__file__).resolve().parent
BOOK = 'https://www.hisawyer.com/dance-institute-denver/schedules/membership-plans'
PHOTO = 'https://www.danceinstitutedenver.com/wp-content/uploads/2026/07/'
classes = json.loads((ROOT / 'classes.json').read_text())

def class_rows():
    rows = []
    for c in classes:
        name = 'Combination' if c['name'].startswith('Combo:') else c['name']
        duration = c['duration'] if c['duration'] != 'Ask studio' else 'Ask the studio about class length.'
        rows.append(f'''<details class="class-item" data-styles="{c['styles']}" data-min="{c['min'] if c['min'] is not None else ''}" data-max="{c['max'] if c['max'] is not None else ''}" data-audience="{c['audience']}" data-search="{html.escape((name+' '+c['name']+' '+c['description']+' '+c['styles']).lower(),quote=True)}"><summary><span class="class-name">{name}</span><span class="class-age">{c['age']}</span><span class="expand-icon" aria-hidden="true">+</span></summary><div class="class-detail"><p>{c['description']}</p><p class="class-duration">{duration}</p><a href="@/class-schedule/">View schedule <span aria-hidden="true">↗</span></a></div></details>''')
    return '\n'.join(rows)

home = {'slug':'','title':'Dance Institute','section':'Home','description':'Classes for children, teens and adults.','body':f'''
<p class="home-intro">Classes for children, teens and adults.</p>
<nav class="home-actions" aria-label="Get started"><a href="@/adult-kids-dance-classes/">Find a class <span aria-hidden="true">↗</span></a><a href="@/class-schedule/">View schedule <span aria-hidden="true">↗</span></a><a href="@/registration/">Register <span aria-hidden="true">↗</span></a></nav>
<figure class="home-photo"><img src="{PHOTO}dance-class-main-1200x459-c-default.webp" width="1200" height="459" alt="Dancers at Dance Institute of Denver" fetchpriority="high"></figure>'''}
classpage = {'slug':'adult-kids-dance-classes/','title':'Dance classes','section':'Dance Classes','description':'Find a dance class by age and style.','body':f'''
<section class="class-finder" aria-label="Class directory"><form id="class-filters" class="finder-controls" hidden><div><label for="age-filter">Age</label><select id="age-filter"><option value="all">All ages</option><option value="baby">Babies & toddlers</option><option value="3-5">3–5 years</option><option value="6-9">6–9 years</option><option value="10-13">10–13 years</option><option value="14-17">14–17 years</option><option value="adult">Adults</option><option value="placement">By placement</option></select></div><div><label for="style-filter">Style</label><select id="style-filter"><option value="all">All styles</option><option value="combo">Combination</option><option value="ballet">Ballet & pointe</option><option value="tap">Tap</option><option value="hiphop">Hip-hop</option><option value="jazz">Jazz</option><option value="lyrical">Lyrical</option><option value="contemporary">Contemporary</option><option value="theater">Musical theater</option><option value="technique">Leaps, turns & tricks</option></select></div><div class="search-control"><label for="class-search">Search</label><input id="class-search" type="search" placeholder="Class name" autocomplete="off"></div><button type="reset" class="reset-button">Reset</button></form><div class="directory-meta"><p id="results-count" role="status" aria-live="polite">16 classes</p><a href="@/class-schedule/">View schedule ↗</a></div><div class="directory-head" aria-hidden="true"><span>Class</span><span>Age / level</span><span></span></div><div id="class-list">{class_rows()}</div><div id="no-results" class="empty-state" hidden><h2>No matching classes</h2><button type="button" id="clear-filters" class="button">Clear filters</button></div><p id="placement-note" class="note" hidden>For advanced classes, choose “By placement” under Age.</p></section>'''}

NAV = [('Home',''),('Dance Classes','adult-kids-dance-classes/'),('About','about/'),('Schedule','class-schedule/'),('Nutcracker','nutcracker/'),('Register','registration/'),('Contact','contact/')]
SUBS = {'About':[('Studio Policies','about/studio-policies/'),('Teachers','about/teachers/'),('Partners','about/partners/')], 'Schedule':[('Dance Schedule','class-schedule/'),('Summer Schedule','summer-schedule/')]}

def shell(page):
    slug=page['slug']; depth=len([p for p in slug.split('/') if p]); base='../'*depth or './'
    def route(target): return base+target
    nav=''
    for label,target in NAV:
        active=(target==slug) if target is not None else slug in ['class-schedule/','summer-schedule/']
        if label in SUBS:
            expanded=(label=='About' and slug.startswith('about/')) or (label=='Schedule' and slug in ['class-schedule/','summer-schedule/'])
            nav+=f'<div class="nav-group"><div class="nav-group-top">'+(f'<a href="{route(target)}"'+(' aria-current="page"' if active else '')+f'>{label}</a>' if target is not None else f'<span>{label}</span>')+f'<button class="subnav-toggle" aria-label="Toggle {label.lower()} pages" aria-controls="subnav-{label.lower()}" aria-expanded="true" hidden><span aria-hidden="true">−</span></button></div><div class="subnav" id="subnav-{label.lower()}" data-default-open="{str(expanded).lower()}">'
            for text,url in SUBS[label]: nav+=f'<a href="{route(url)}"'+(' aria-current="page"' if slug==url else '')+f'>{text}</a>'
            nav+='</div></div>'
        else: nav+=f'<a href="{route(target)}"'+(' aria-current="page"' if active else '')+f'>{label}<span aria-hidden="true">↗</span></a>'
    title=html.escape(page['title']);description=html.escape(page['description']);body=re.sub(r'@/([^"\s<>]*)',lambda m:route(m.group(1)),page['body'])
    css_version=hashlib.sha256((ROOT/'styles.css').read_bytes()).hexdigest()[:10]
    js_version=hashlib.sha256((ROOT/'script.js').read_bytes()).hexdigest()[:10]
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#203b2e"><meta name="description" content="{description}"><title>{title}{' | Dance Institute of Denver' if slug else ' of Denver'}</title><link rel="icon" href="{base}favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Libre+Caslon+Display&display=swap" rel="stylesheet"><link rel="stylesheet" href="{base}styles.css?v={css_version}"><script src="{base}script.js?v={js_version}" defer></script></head><body>
<a class="skip-link" href="#main">Skip to content</a><aside class="studio-nav"><div class="brand-row"><a class="wordmark" href="{base}" aria-label="Dance Institute of Denver home"><span class="brand-emblem" aria-hidden="true"><img src="{base}studio-seal.svg" alt="" width="58" height="76"></span><span>Dance<br>Institute<small>Denver, Colorado</small></span></a><button class="menu-toggle" aria-controls="site-navigation" aria-expanded="true" hidden>Menu <span aria-hidden="true">−</span></button></div><div id="site-navigation" class="navigation-content"><nav aria-label="Main navigation">{nav}</nav></div></aside>
<div class="page-shell"><main id="main" tabindex="-1"><header class="page-heading"><h1>{title}</h1></header>{body}</main><footer class="footer"><span>© <span data-year>2026</span> Dance Institute</span><div><a href="{route('sitemap/')}">Sitemap</a><a href="{route('privacy-policy/')}">Privacy policy</a></div></footer></div>
</body></html>'''

if __name__=='__main__':
    pages=[home,classpage]+json.loads((ROOT/'page-content.json').read_text())
    pages.append({'slug':'sitemap/','title':'Sitemap','section':'Sitemap','description':'All studio pages.','body':'<div class="link-list">'+''.join(f'<a href="@/{p["slug"]}">{html.escape(p["title"])} <span aria-hidden="true">↗</span></a>' for p in pages)+'</div>'})
    for page in pages:
        destination=ROOT/page['slug']/'index.html';destination.parent.mkdir(parents=True,exist_ok=True);destination.write_text(shell(page))
    print(f'Built {len(pages)} static pages.')
