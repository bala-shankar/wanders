type Photo = { src: string; caption?: string; alt?: string };
type Trip = { id: string; title: string; location?: string; year?: string; photos: Photo[]; cover?: string };

const trips: Trip[] = [
  {
    id: 'trip-kyoto',
    title: 'Kyoto, Japan',
    location: 'Kyoto',
    year: '2023',
    cover: 'assets/images/1.jpg',
    photos: [
      { src: 'assets/images/1.jpg', caption: 'Temple at sunrise', alt: 'temple' },
      { src: 'assets/images/1.jpg', caption: 'Red bridge', alt: 'bridge' },
      { src: 'assets/images/1.jpg', caption: 'Autumn path', alt: 'autumn' }
    ]
  },
  {
    id: 'trip-himalayas',
    title: 'Himalayas Trek',
    location: 'India',
    year: '2024',
    cover: 'assets/images/himalaya1.jpg',
    photos: [
      { src: 'assets/images/himalaya1.jpg', caption: 'Mountain view', alt: 'mountain' },
      { src: 'assets/images/himalaya2.jpg', caption: 'Trail', alt: 'trail' }
    ]
  },
  {
    id: 'trip-europe',
    title: 'European Roadtrip',
    location: 'Multiple',
    year: '2022',
    cover: 'assets/images/europe1.jpg',
    photos: [
      { src: 'assets/images/europe1.jpg', caption: 'Countryside', alt: 'countryside' },
      { src: 'assets/images/europe2.jpg', caption: 'Coastal town', alt: 'coastal' },
      { src: 'assets/images/europe3.jpg', caption: 'City at dusk', alt: 'city' }
    ]
  }
];

// Minimal DOM helpers & app logic
const $ = (s: string) => document.querySelector(s);
const $$ = (s: string) => Array.from(document.querySelectorAll(s));

function createTripCard(trip: Trip) {
  const card = document.createElement('article');
  card.className = 'trip-card';
  card.setAttribute('data-trip', trip.id);

  const img = document.createElement('img');
  img.className = 'trip-thumb';
  img.src = trip.cover || trip.photos[0].src;
  img.alt = trip.title;

  const meta = document.createElement('div');
  meta.className = 'trip-meta';
  meta.innerHTML = `<div>
      <div class="trip-title">${trip.title}</div>
      <div class="trip-sub">${trip.location || ''} • ${trip.year || ''}</div>
    </div>
    <div class="trip-count">${trip.photos.length} photos</div>`;

  card.appendChild(img);
  card.appendChild(meta);
  card.addEventListener('click', () => openModalForTrip(trip));
  return card;
}

function renderTrips() {
  const container = document.getElementById('trips')!;
  trips.forEach(t => container.appendChild(createTripCard(t)));

  // entrance animation with GSAP
  // @ts-ignore
  gsap.from('.trip-card', { y: 18, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' });
}

// Modal / slideshow
let currentTrip: Trip | null = null;
let currentIndex = 0;

function openModalForTrip(trip: Trip) {
  currentTrip = trip;
  currentIndex = 0;
  const modal = document.getElementById('modal')!;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  showSlide();
  // fade in modal
  // @ts-ignore
  gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.35 });
}

function closeModal() {
  const modal = document.getElementById('modal')!;
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // simple fade out
  // @ts-ignore
  gsap.to(modal, { opacity: 0, duration: 0.25 });
}

function showSlide() {
  if (!currentTrip) return;
  const slideArea = document.getElementById('slideArea')!;
  slideArea.innerHTML = '';
  const photo = currentTrip.photos[currentIndex];

  const img = document.createElement('img');
  img.src = photo.src;
  img.alt = photo.alt || photo.caption || currentTrip.title;
  slideArea.appendChild(img);

  const caption = document.getElementById('caption')!;
  caption.textContent = photo.caption || '';

  // animate image in
  // @ts-ignore
  gsap.from(img, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' });
}

function nextSlide() {
  if (!currentTrip) return;
  currentIndex = (currentIndex + 1) % currentTrip.photos.length;
  showSlide();
}
function prevSlide() {
  if (!currentTrip) return;
  currentIndex = (currentIndex - 1 + currentTrip.photos.length) % currentTrip.photos.length;
  showSlide();
}

function attachEvents() {
  (document.getElementById('modalClose')!).addEventListener('click', closeModal);
  (document.getElementById('nextBtn')!).addEventListener('click', nextSlide);
  (document.getElementById('prevBtn')!).addEventListener('click', prevSlide);

  // keyboard navigation
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('modal')!;
    if (modal.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape') closeModal();
  });

  // click outside image closes modal
  document.getElementById('modal')!.addEventListener('click', (ev) => {
    const target = ev.target as HTMLElement;
    if (target.id === 'modal') closeModal();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderTrips();
  attachEvents();
});
