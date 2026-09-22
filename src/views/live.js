/**
 * View: LIVE (Section 10 of design.doc)
 * Pinterest + Editorial Lifestyle Magazine feel
 * Large heading: "Don't forget to live."
 * Curated experience cards with candid photography dynamically matched to experience title
 */
import { store } from '../store.js';
import confetti from 'canvas-confetti';

let isAddingExperience = false;
let editingExperienceId = null;

/**
 * Intelligent Dynamic Photo Resolution Engine based on Experience Title
 * (100% driven by experience title keywords, completely independent of category)
 */
export function getExperienceImageForTitle(title, customPhotoUrl = '') {
  if (!title) {
    return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80';
  }

  const t = title.toLowerCase().trim();

  // 1. Horror / Scary / Thriller / Spooky / Ghost / Haunted / Halloween
  if (t.includes('horror') || t.includes('scary') || t.includes('thriller') || t.includes('spooky') || t.includes('ghost') || t.includes('haunt') || t.includes('halloween') || t.includes('creepy')) {
    return 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80'; // Dark atmospheric horror & thriller cinema
  }

  // 2. Gaming / Video Games / PlayStation / Console / Controller
  if (t.includes('game') || t.includes('gaming') || t.includes('playstation') || t.includes('xbox') || t.includes('nintendo') || t.includes('console')) {
    return 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80';
  }

  // 2. Boyfriend / Date / Partner / Husband / Couple / Romance / Meeting BF / GF / Love
  if (t.includes('bf') || t.includes('boyfriend') || t.includes('husband') || t.includes('partner') || t.includes('romantic') || t.includes('couple') || t.includes('love') || t.includes('gf') || t.includes('girlfriend') || t.includes('meeting my') || t.includes('date night') || t.includes('anniversary')) {
    return 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80';
  }

  // 3. Cafe / Coffee / Matcha / Bakery / Breakfast / Brunch / Latte / Croissant / Espresso
  if (t.includes('caf') || t.includes('coffee') || t.includes('matcha') || t.includes('bakery') || t.includes('latte') || t.includes('croissant') || t.includes('brunch') || t.includes('breakfast') || t.includes('bistro') || t.includes('espresso') || t.includes('cappuccino')) {
    return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80';
  }

  // 4. Movie / Cinema / Film / Theater / Theatre / Netflix / Show / Barbie / Oppenheimer
  if (t.includes('movie') || t.includes('cinema') || t.includes('film') || t.includes('theater') || t.includes('theatre') || t.includes('watch') || t.includes('netflix') || t.includes('screening') || t.includes('imax')) {
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
  }

  // 5. Sunset / Sunrise / Golden Hour / Sky / Dusk / Dawn / Twilight / Stargaze / Moon
  if (t.includes('sunset') || t.includes('sunrise') || t.includes('golden hour') || t.includes('dusk') || t.includes('dawn') || t.includes('twilight') || t.includes('sky') || t.includes('horizon')) {
    return 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=800&q=80';
  }

  // 6. Stargazing / Night Sky / Stars / Astronomy / Rooftop Night / Constellation
  if (t.includes('star') || t.includes('stargaz') || t.includes('night sky') || t.includes('astronomy') || t.includes('moon') || t.includes('telescope')) {
    return 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80';
  }

  // 7. Friends / Besties / Girls Night / Pasta Night / Party / Gathering / Hangout / Sleepover
  if (t.includes('friend') || t.includes('bestie') || t.includes('girls') || t.includes('gathering') || t.includes('party') || t.includes('hangout') || t.includes('sleepover') || t.includes('reunion')) {
    return 'https://images.unsplash.com/photo-1517256673644-36ad11246d21?auto=format&fit=crop&w=800&q=80';
  }

  // 8. Pottery / Ceramics / Clay / Sculpting
  if (t.includes('pottery') || t.includes('ceramic') || t.includes('clay') || t.includes('wheel') || t.includes('sculpt')) {
    return 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80';
  }

  // 9. Art / Painting / Drawing / Watercolor / Sketch / Canvas / Creative / Craft / DIY
  if (t.includes('paint') || t.includes('art') || t.includes('draw') || t.includes('sketch') || t.includes('watercolor') || t.includes('canvas') || t.includes('craft') || t.includes('diy') || t.includes('creative')) {
    return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80';
  }

  // 10. Bookstore / Book / Reading / Library / Novel / Poetry / Journal / Write / Letter
  if (t.includes('book') || t.includes('read') || t.includes('library') || t.includes('bookstore') || t.includes('novel') || t.includes('poem') || t.includes('poetry') || t.includes('journal') || t.includes('write') || t.includes('letter')) {
    return 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80';
  }

  // 11. Coding / Tech / Laptop / Study / Programming / Deep Work / Desk Setup / Python
  if (t.includes('cod') || t.includes('tech') || t.includes('laptop') || t.includes('program') || t.includes('study') || t.includes('developer') || t.includes('hackathon') || t.includes('computer') || t.includes('work session')) {
    return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
  }

  // 12. Greenhouse / Plants / Flowers / Garden / Botanical / Florist / Bouquet
  if (t.includes('greenhouse') || t.includes('botanical') || t.includes('plant') || t.includes('flower') || t.includes('garden') || t.includes('florist') || t.includes('bouquet') || t.includes('rose')) {
    return 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80';
  }

  // 13. Beach / Ocean / Sea / Coastal / Waves / Surfing / Sand
  if (t.includes('beach') || t.includes('ocean') || t.includes('sea') || t.includes('coast') || t.includes('surf') || t.includes('sand') || t.includes('island') || t.includes('tide')) {
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
  }

  // 14. Lake / River / Boat / Sailing / Kayak / Canoe
  if (t.includes('lake') || t.includes('river') || t.includes('boat') || t.includes('sail') || t.includes('kayak') || t.includes('canoe')) {
    return 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80';
  }

  // 15. Workout / Pilates / Gym / Yoga / Lifting / Fitness / Stretch / Core
  if (t.includes('gym') || t.includes('workout') || t.includes('pilates') || t.includes('yoga') || t.includes('lift') || t.includes('fitness') || t.includes('stretch') || t.includes('exercise')) {
    return 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80';
  }

  // 16. Running / Jog / Walk / Morning Walk / Hike / Trail / Mountain
  if (t.includes('run') || t.includes('jog') || t.includes('walk') || t.includes('hike') || t.includes('trail') || t.includes('mountain') || t.includes('trek')) {
    return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80';
  }

  // 17. Cycling / Bike / Ride / Biking
  if (t.includes('cycle') || t.includes('bike') || t.includes('cycling') || t.includes('biking')) {
    return 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80';
  }

  // 18. Swimming / Pool / Resort / Cabana / Swim
  if (t.includes('swim') || t.includes('pool') || t.includes('resort') || t.includes('cabana')) {
    return 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80';
  }

  // 19. Sushi / Japanese / Ramen / Dim Sum / Asian / Noodles / Dumplings
  if (t.includes('sushi') || t.includes('ramen') || t.includes('japanese') || t.includes('dim sum') || t.includes('noodle') || t.includes('dumpling') || t.includes('asian')) {
    return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80';
  }

  // 20. Pizza / Pasta / Italian / Dinner / Candlelight Dinner / Wine / Wine Night / Cocktails / Bar
  if (t.includes('pizza') || t.includes('pasta') || t.includes('italian') || t.includes('dinner') || t.includes('wine') || t.includes('cocktail') || t.includes('bar') || t.includes('rooftop')) {
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';
  }

  // 21. Ice Cream / Gelato / Dessert / Cake / Pastry / Sweet / Chocolate / Sourdough / Baking
  if (t.includes('ice cream') || t.includes('gelato') || t.includes('dessert') || t.includes('cake') || t.includes('pastry') || t.includes('chocolate') || t.includes('sourdough') || t.includes('baking') || t.includes('cookie')) {
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80';
  }

  // 22. Tea / Herbal Tea / Chai / Tea Ceremony / Matcha Tea
  if (t.includes('tea') || t.includes('chai') || t.includes('chamomile') || t.includes('herbal')) {
    return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80';
  }

  // 23. Picnic / Blanket / Park Lunch / Basket
  if (t.includes('picnic') || t.includes('basket') || t.includes('lawn')) {
    return 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80';
  }

  // 24. Museum / Gallery / Exhibition / Sculpture / Architecture
  if (t.includes('museum') || t.includes('gallery') || t.includes('exhibit') || t.includes('sculpture') || t.includes('architecture') || t.includes('louvre') || t.includes('met')) {
    return 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80';
  }

  // 25. Shopping / Vintage / Thrift / Clothes / Fashion / Dress / Boutique / Flea Market
  if (t.includes('shop') || t.includes('vintage') || t.includes('thrift') || t.includes('clothe') || t.includes('fashion') || t.includes('boutique') || t.includes('mall') || t.includes('flea')) {
    return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80';
  }

  // 26. Music / Concert / Vinyl / Record / Song / Festival / Piano / Guitar / Instrument
  if (t.includes('music') || t.includes('concert') || t.includes('vinyl') || t.includes('record') || t.includes('festival') || t.includes('piano') || t.includes('guitar') || t.includes('sing') || t.includes('album')) {
    return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80';
  }

  // 27. Photography / Camera / 35mm / Photo Shoot / Portrait / Polaroid
  if (t.includes('photo') || t.includes('camera') || t.includes('35mm') || t.includes('shoot') || t.includes('polaroid') || t.includes('lens')) {
    return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80';
  }

  // 28. Travel / Flight / Airport / Hotel / Trip / Vacation / Paris / Tokyo / NYC / Italy / London
  if (t.includes('travel') || t.includes('trip') || t.includes('flight') || t.includes('airport') || t.includes('hotel') || t.includes('vacation') || t.includes('road trip') || t.includes('paris') || t.includes('tokyo') || t.includes('nyc') || t.includes('italy') || t.includes('london')) {
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
  }

  // 29. Spa / Skincare / Bath / Relax / Massage / Candle / Face Mask / Bubble Bath
  if (t.includes('spa') || t.includes('skin') || t.includes('bath') || t.includes('massage') || t.includes('relax') || t.includes('self care') || t.includes('candle') || t.includes('mask') || t.includes('facial')) {
    return 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80';
  }

  // 30. Rain / Rainy Day / Rain on Window / Cozy Indoors / Storm
  if (t.includes('rain') || t.includes('storm') || t.includes('cozy day') || t.includes('fog')) {
    return 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80';
  }

  // 31. Cat / Kitten / Cuddle / Kitty
  if (t.includes('cat') || t.includes('kitten') || t.includes('kitty') || t.includes('feline')) {
    return 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80';
  }

  // 32. Dog / Puppy / Pet Walk / Golden Retriever
  if (t.includes('dog') || t.includes('puppy') || t.includes('canine') || t.includes('pet')) {
    return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80';
  }

  // 33. Autumn / Fall Leaves / Pumpkin / Amber / Crisp
  if (t.includes('autumn') || t.includes('fall') || t.includes('pumpkin') || t.includes('leaves')) {
    return 'https://images.unsplash.com/photo-1507371341162-763b5e419408?auto=format&fit=crop&w=800&q=80';
  }

  // 34. Winter / Snow / Hot Cocoa / Fireplace / Cozy Blanket
  if (t.includes('winter') || t.includes('snow') || t.includes('cocoa') || t.includes('fireplace') || t.includes('cold')) {
    return 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=800&q=80';
  }

  // 35. Spring / Cherry Blossom / Bloom
  if (t.includes('spring') || t.includes('blossom') || t.includes('bloom') || t.includes('sakura')) {
    return 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80';
  }

  // 36. Camping / Bonfire / Camp / Tent / Wilderness / Cabin
  if (t.includes('camp') || t.includes('bonfire') || t.includes('tent') || t.includes('cabin') || t.includes('s\'more')) {
    return 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80';
  }

  // Fallback high aesthetic lifestyle photo
  return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80';
}

export function renderLiveView(container) {
  const state = store.state;
  const cards = state.live.cards;

  const editingCard = editingExperienceId 
    ? cards.find(c => c.id === editingExperienceId) 
    : null;

  container.innerHTML = `
    <div class="view-live">
      <div class="hero-editorial-card" style="margin-bottom: 2rem; background: linear-gradient(135deg, var(--bg-card) 0%, var(--color-peach-light) 100%);">
        <span class="hero-tagline">INTENTIONAL LIVING</span>
        <h1 class="hero-greeting" style="font-size: 3.5rem;">Don't forget to live.</h1>
        <p class="hero-message">“Productivity without presence is just exhaustion. Life is happening right now, in ordinary, beautiful moments.”</p>
      </div>

      <!-- Pinterest-style Lifestyle Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.8rem;">
        ${cards.map(card => {
          const dynamicImg = getExperienceImageForTitle(card.title, card.image);
          return `
            <div class="her-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; border-radius: var(--radius-xl); border: 1px solid var(--border-color); background: var(--bg-card); backdrop-filter: var(--glass-blur);">
              
              <!-- Image Frame (Dynamic by Experience Title) -->
              <div style="height: 220px; overflow: hidden; position: relative;">
                <img src="${dynamicImg}" alt="${card.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);">
                <span class="card-tag" style="position: absolute; top: 1rem; left: 1rem; background: var(--bg-glass); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); color: var(--text-primary); border: 1px solid rgba(224,138,149,0.3);">
                  ${card.tag}
                </span>
                ${card.done ? `
                  <span class="card-tag" style="position: absolute; top: 1rem; right: 1rem; background: var(--color-burgundy); color: #fff; border: 1px solid var(--color-rose);">
                    ✓ Experienced
                  </span>
                ` : ''}

                <!-- Quick Edit / Delete Buttons -->
                <div style="position: absolute; bottom: 0.6rem; right: 0.6rem; display: flex; gap: 0.4rem;">
                  <button class="edit-live-card-btn" data-id="${card.id}" style="background: rgba(20,8,9,0.75); border: 1px solid rgba(224,138,149,0.4); color: #fff; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; cursor: pointer; backdrop-filter: blur(8px);" title="Edit Experience">
                    ✎
                  </button>
                  <button class="delete-live-card-btn" data-id="${card.id}" style="background: rgba(20,8,9,0.75); border: 1px solid rgba(224,138,149,0.4); color: var(--color-rose); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; cursor: pointer; backdrop-filter: blur(8px);" title="Delete Experience">
                    🗑️
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div style="padding: 1.6rem; display: flex; flex-direction: column; justify-content: space-between; flex: 1;">
                <div>
                  <h3 style="font-family: var(--font-serif); font-size: 1.55rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.4rem;">
                    ${card.title}
                  </h3>
                  <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.2rem;">
                    ${card.desc}
                  </p>
                </div>

                <button class="btn-secondary toggle-live-card-btn" data-id="${card.id}" style="width: 100%; ${card.done ? 'background: var(--bg-card-subtle); border-color: var(--color-rose); color: var(--color-rose); font-weight: 700;' : ''}">
                  ${card.done ? '✓ Completed Experience' : 'Mark as Experienced'}
                </button>
              </div>

            </div>
          `;
        }).join('')}
      </div>

      <!-- Add Custom Experience Trigger -->
      <div style="margin-top: 2.5rem; text-align: center;">
        <button class="btn-primary" id="open-add-live-card-btn" style="padding: 0.85rem 2.2rem;">
          <span>+ Add Personal Life Experience</span>
        </button>
      </div>

      <!-- CUSTOM MODAL CARD: ADD OR EDIT LIFE EXPERIENCE -->
      ${(isAddingExperience || editingCard) ? `
        <div class="custom-modal-backdrop" id="experience-modal-overlay">
          <div class="her-card custom-modal-card" style="max-width: 580px; width: 100%; padding: 2.2rem; border: 1.5px solid var(--color-rose); box-shadow: var(--shadow-lg), 0 0 35px rgba(224, 138, 149, 0.25); position: relative;">
            <div class="card-header" style="border-bottom: 1px dashed var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="card-tag" style="background: var(--color-burgundy-light); color: var(--color-rose); font-weight: 700;">LIFESTYLE MAGAZINE</span>
                <h3 class="card-title" style="margin-top: 0.3rem; font-size: 1.45rem; color: var(--text-primary);">
                  <span>✨</span> ${editingCard ? 'Edit Life Experience' : 'Add Life Experience'}
                </h3>
              </div>
              <button class="btn-ghost" id="close-modal-x" style="font-size: 1.2rem; padding: 0.2rem 0.6rem; cursor: pointer;">✕</button>
            </div>

            <form id="experience-modal-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div>
                <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">
                  Experience Title
                </label>
                <input type="text" id="exp-title-input" class="profile-input-field" required 
                  value="${editingCard ? editingCard.title : ''}" 
                  placeholder="e.g. Watching horror movie, Meeting my bf, Sunset matcha, Bookstore walk..." 
                  style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none;">
              </div>

              <div>
                <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Category Tag</label>
                <select id="exp-tag-select" class="profile-input-field" style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none; cursor: pointer;">
                  <option value="🌿 Solo Date" ${editingCard && editingCard.tag.includes('Solo') ? 'selected' : ''}>🌿 Solo Date</option>
                  <option value="☕ Coffee & Cafés" ${editingCard && editingCard.tag.includes('Coffee') ? 'selected' : ''}>☕ Coffee & Cafés</option>
                  <option value="👯 Connection & Friends" ${editingCard && editingCard.tag.includes('Connection') ? 'selected' : ''}>👯 Connection & Friends</option>
                  <option value="🎬 Rest & Film" ${editingCard && editingCard.tag.includes('Film') ? 'selected' : ''}>🎬 Rest & Film</option>
                  <option value="🎨 Creativity & Art" ${editingCard && editingCard.tag.includes('Creativ') ? 'selected' : ''}>🎨 Creativity & Art</option>
                  <option value="🌅 Nature & Sunset" ${editingCard && editingCard.tag.includes('Nature') || editingCard && editingCard.tag.includes('Sunset') ? 'selected' : ''}>🌅 Nature & Sunset</option>
                  <option value="✨ Personal Joy" ${editingCard && editingCard.tag.includes('Joy') ? 'selected' : ''}>✨ Personal Joy</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">Describe the Moment & Vibe</label>
                <textarea id="exp-desc-input" rows="2" class="profile-input-field" placeholder="e.g. Quiet reading in a corner table with herbal tea and notebook." style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-card-subtle); color: var(--text-primary); font-size: 0.95rem; outline: none; font-family: var(--font-sans);">${editingCard ? editingCard.desc : ''}</textarea>
              </div>

              <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 0.8rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                <button type="button" id="cancel-exp-modal-btn" class="btn-ghost" style="padding: 0.7rem 1.4rem; border-radius: var(--radius-full); cursor: pointer;">Cancel</button>
                <button type="submit" class="action-pill-btn" style="background: var(--color-burgundy); color: #FFFFFF; border: 1px solid var(--color-rose); padding: 0.7rem 1.8rem; font-weight: 700; border-radius: var(--radius-full); cursor: pointer;">
                  ${editingCard ? '💾 Save Changes' : '+ Add to Life Magazine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  attachLiveListeners(container);
}

function attachLiveListeners(container) {
  // Toggle card completed state
  container.querySelectorAll('.toggle-live-card-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      store.toggleLiveCard(id);
      confetti({ particleCount: 35, spread: 55, origin: { y: 0.7 } });
      renderLiveView(container);
    });
  });

  // Edit Card
  container.querySelectorAll('.edit-live-card-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      editingExperienceId = btn.dataset.id;
      isAddingExperience = false;
      renderLiveView(container);
    });
  });

  // Delete Card
  container.querySelectorAll('.delete-live-card-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      store.state.live.cards = store.state.live.cards.filter(c => c.id !== id);
      store.saveState();
      renderLiveView(container);
    });
  });

  // Open Add modal
  const openModalBtn = container.querySelector('#open-add-live-card-btn');
  if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
      isAddingExperience = true;
      editingExperienceId = null;
      renderLiveView(container);
    });
  }

  // Close modal
  const closeModalX = container.querySelector('#close-modal-x');
  const cancelBtn = container.querySelector('#cancel-exp-modal-btn');
  const overlay = container.querySelector('#experience-modal-overlay');

  const closeModal = () => {
    isAddingExperience = false;
    editingExperienceId = null;
    renderLiveView(container);
  };

  if (closeModalX) closeModalX.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  // Form submission (Add or Edit)
  const form = container.querySelector('#experience-modal-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = (container.querySelector('#exp-title-input')?.value || '').trim();
      const tag = container.querySelector('#exp-tag-select')?.value || '✨ Personal Joy';
      const desc = (container.querySelector('#exp-desc-input')?.value || '').trim();
      const dynamicImage = getExperienceImageForTitle(title);

      if (!title) return;

      if (editingExperienceId) {
        // Edit existing card
        const card = store.state.live.cards.find(c => c.id === editingExperienceId);
        if (card) {
          card.title = title;
          card.tag = tag;
          card.desc = desc;
          card.image = dynamicImage;
        }
      } else {
        // Add new card (done is false by default)
        store.state.live.cards.unshift({
          id: 'lc-' + Date.now(),
          title,
          tag,
          desc,
          image: dynamicImage,
          done: false
        });
      }

      store.saveState();
      isAddingExperience = false;
      editingExperienceId = null;
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      renderLiveView(container);
    });
  }
}

