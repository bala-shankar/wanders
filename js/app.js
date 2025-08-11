// Add this near the top
var priorityImages = [
    'assets/Rishikesh/4.jpg',
    'assets/Daramshala/1.jpg',
    'assets/Pune/1.jpg'
    // Add more important images here
];


// =====================
// Trips Data
// =====================
var trips = [
    {
        id: 'trip-kyoto',
        title: 'Kyoto, Japan',
        location: 'Rishikesh',
        year: '2025',
        cover: 'assets/Rishikesh/4.jpg',
        photos: [
            { src: 'assets/Rishikesh/1.jpg'},
            { src: 'assets/Rishikesh/2.jpg'},
            { src: 'assets/Rishikesh/3.jpg'},
            { src: 'assets/Rishikesh/5.jpg'},
            { src: 'assets/Rishikesh/6.jpg'},
            { src: 'assets/Rishikesh/7.jpg'},
            { src: 'assets/Rishikesh/8.jpg'},
            { src: 'assets/Rishikesh/9.jpg'},
            { src: 'assets/Rishikesh/4.jpg'},
            { src: 'https://drive.google.com/uc?export=download&id=1c1_1nIghdCCTYIj_42865kx9W9sNDUTE'},
            { src: 'https://drive.google.com/uc?export=download&id=11BmSazYz5rXgV0NhBfGn5Y8AC-69mnfQ'},
            { src: 'https://drive.google.com/uc?export=download&id=1kAtwUKCApGRqJV_biME7T9zRN4QW512m'}
        ]
    },
    {
        id: 'trip-himalayas',
        title: 'Himalayas Trek',
        location: 'Daramshala',
        year: '2025',
        cover: 'assets/Daramshala/1.jpg',
        photos: [
            { src: 'assets/Daramshala/2.jpg'},
            { src: 'assets/Daramshala/3.jpg'},
            { src: 'assets/Daramshala/4.jpg'},
            { src: 'assets/Daramshala/5.jpg'},
            { src: 'assets/Daramshala/6.jpg'},
            { src: 'assets/Daramshala/1.jpg'},
            { src: 'assets/Daramshala/1-1.mp4'}
        ]
    },
    {
        id: 'trip-europe',
        title: 'European Roadtrip',
        location: 'Maharastra',
        year: '2025',
        cover: 'assets/Pune/1.jpg',
        photos: [
            { src: 'assets/Pune/2.jpg'},
            { src: 'assets/Pune/3.jpg'},
            { src: 'assets/Pune/4.jpg'},
            { src: 'assets/Pune/5.jpg'},
            { src: 'assets/Pune/6.jpg'},
            { src: 'assets/Pune/7.jpg'},
            { src: 'assets/Pune/8.jpg'},
            { src: 'assets/Pune/1.jpg'},
            { src: 'assets/Pune/1-1.mp4'},
            { src: 'https://drive.google.com/uc?export=download&id=1eo2u_qjQzNm82-XjmJF5C28mHSQJMvfx'},
            { src: 'assets/Pune/1-3.mp4'},
            { src: 'assets/Pune/1-4.mp4'},
            { src: 'assets/Pune/1-5.mp4'},
            { src: 'https://drive.google.com/uc?export=download&id=1qvaXzrAlAZ3ypB_SiQNXMrf7a7LIUWk4'},
            { src: 'https://drive.google.com/uc?export=download&id=1PDKzdSHX2Mg5OIl6730EbnrJs7XNcsE0'},
            { src: 'assets/Pune/1-8.mp4'},
            { src: 'https://drive.google.com/uc?export=download&id=1dfEuildUc5ANdXNySnWA2A2zC_OfH5oY'}
        ]
    }
];

// Helpers
var $ = s => document.querySelector(s);
var $$ = s => Array.from(document.querySelectorAll(s));

function isVideoFile(src) {
    return /\.(mp4|webm|ogg)$/i.test(src);
}

// =====================
// Create Trip Card
// =====================
function createTripCard(trip) {
    var card = document.createElement('article');
    card.className = 'trip-card';
    card.setAttribute('data-trip', trip.id);

    var coverSrc = trip.cover || (trip.photos.length > 0 ? trip.photos[0].src : '');
    var isVideo = /\.(mp4|webm|ogg)$/i.test(coverSrc) 
                  || coverSrc.includes('drive') 
                  || coverSrc.includes('bala-shankar.github.io');

    var mediaElement;
    if (isVideo) {
        mediaElement = document.createElement('video');
        mediaElement.src = coverSrc;
        mediaElement.autoplay = true;
        mediaElement.loop = true;
        mediaElement.muted = true;
        mediaElement.playsInline = true;
        mediaElement.controls = false;
        mediaElement.className = 'trip-thumb';
        mediaElement.style.objectFit = 'cover';
        mediaElement.style.width = '100%';
        mediaElement.style.height = '160px';
        mediaElement.style.borderRadius = '10px';
        mediaElement.setAttribute('aria-label', trip.title + " video thumbnail");
    } else {
        mediaElement = document.createElement('img');
        mediaElement.className = 'trip-thumb';
        mediaElement.src = coverSrc;
        mediaElement.alt = trip.title;
    }
    card.appendChild(mediaElement);

    function isVideoSrc(src) {
        return /\.(mp4|webm|ogg)$/i.test(src) || src.includes('drive') || src.includes('bala-shankar.github.io');
    }

    var photoCount = trip.photos.filter(p => !isVideoSrc(p.src)).length;
    var videoCount = trip.photos.length - photoCount;

    var countStr = '';
    if(photoCount > 0) countStr += `${photoCount} photo${photoCount > 1 ? 's' : ''}`;
    if(videoCount > 0) {
        if(countStr) countStr += ' • ';
        countStr += `${videoCount} video${videoCount > 1 ? 's' : ''}`;
    }

    var meta = document.createElement('div');
    meta.className = 'trip-meta';
    meta.innerHTML = `
    <div>
        <div class="trip-title">${trip.location || ''} • ${trip.year || ''}</div>
    </div>
    <div class="trip-count">${countStr}</div>
`;

    card.appendChild(meta);

    card.addEventListener('click', () => openModalForTrip(trip));

    return card;
}

// =====================
// Render Trips
// =====================
function renderTrips() {
    var container = document.getElementById('trips');
    trips.forEach(t => container.appendChild(createTripCard(t)));
    gsap.from('.trip-card', { y: 18, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' });
}

// =====================
// Slideshow Logic
// =====================
var currentTrip = null;
var currentIndex = 0;

function showSlide() {
    if (!currentTrip) return;

    var slideArea = document.getElementById('slideArea');
    slideArea.innerHTML = '';

    var photo = currentTrip.photos[currentIndex];

    const photoStyles = {
        maxWidth: "100%",
        maxHeight: "75vh",
        borderRadius: "10px",
        display: 'block',
        margin: '0 auto',
    };

    const isMobile = window.innerWidth <= 768;

    const videoStylesDesktop = {
        maxWidth: "60vw",
        maxHeight: "60vh",
        borderRadius: "10px",
        display: 'block',
        margin: '0 auto',
    };
    const videoStylesMobile = {
        maxWidth: "100vw",
        maxHeight: "50vh",
        borderRadius: "10px",
        display: 'block',
        margin: '0 auto',
    };

    const githubVideoStylesDesktop = {
        maxWidth: "80vw",
        maxHeight: "75vh",
        borderRadius: "10px",
        display: 'block',
        margin: '0 auto',
    };
    const githubVideoStylesMobile = {
        maxWidth: "100vw",
        maxHeight: "60vh",
        borderRadius: "10px",
        display: 'block',
        margin: '0 auto',
    };

    const iframeStylesDesktop = {
        width: '60vw',
        height: '60vh',
        borderRadius: '10px',
        display: 'block',
        margin: '0 auto',
    };
    const iframeStylesMobile = {
        width: '90vw',
        height: '40vh',
        borderRadius: '10px',
        display: 'block',
        margin: '0 auto',
    };

    function createSpinner() {
        const spinnerWrapper = document.createElement('div');
        spinnerWrapper.style.position = 'absolute';
        spinnerWrapper.style.top = '50%';
        spinnerWrapper.style.left = '50%';
        spinnerWrapper.style.transform = 'translate(-50%, -50%)';
        spinnerWrapper.style.pointerEvents = 'none';
        spinnerWrapper.innerHTML = `<div class="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"></div>`;
        return spinnerWrapper;
    }

    if (photo.src.includes('drive.google.com') || photo.src.includes('drive.googleusercontent.com')) {
        let fileId = null;
        const matchFileId = photo.src.match(/\/file\/d\/([^\/]+)/) || photo.src.match(/id=([^&]+)/);
        if (matchFileId) {
            fileId = matchFileId[1];
        }

        if (fileId) {
            var iframe = document.createElement('iframe');
            iframe.src = `https://drive.google.com/file/d/${fileId}/preview`;
            iframe.allow = 'autoplay';
            iframe.frameBorder = '0';
            iframe.allowFullscreen = true;
            Object.assign(iframe.style, isMobile ? iframeStylesMobile : iframeStylesDesktop);
            slideArea.appendChild(iframe);
        } else {
            slideArea.textContent = 'Invalid Google Drive video URL.';
        }
    } else if (isVideoFile(photo.src)) {
        const isGitHubPagesVideo = photo.src.includes('bala-shankar.github.io');

        if (isGitHubPagesVideo) {
            const container = document.createElement('div');
            container.style.position = 'relative';
            container.style.display = 'inline-block';

            const thumbnailSrc = photo.src.replace(/\.\w+$/, '.jpg');

            const thumbnail = document.createElement('img');
            thumbnail.src = thumbnailSrc;
            Object.assign(thumbnail.style, {
                maxWidth: isMobile ? "100vw" : "80vw",
                maxHeight: isMobile ? "60vh" : "75vh",
                borderRadius: "10px",
                display: 'block',
                margin: '0 auto',
                filter: 'brightness(0.7)',
            });

            const spinner = createSpinner();

            const videoEl = document.createElement('video');
            videoEl.src = photo.src;
            videoEl.muted = true;
            videoEl.autoplay = true;
            videoEl.loop = true;
            videoEl.playsInline = true;
            videoEl.controls = false;
            videoEl.preload = "metadata";
            Object.assign(videoEl.style, isMobile ? githubVideoStylesMobile : githubVideoStylesDesktop);
            videoEl.style.position = 'absolute';
            videoEl.style.top = '0';
            videoEl.style.left = '0';
            videoEl.style.width = '100%';
            videoEl.style.height = '100%';
            videoEl.style.borderRadius = '10px';
            videoEl.style.objectFit = 'cover';
            videoEl.style.display = 'none';

            videoEl.addEventListener('canplay', () => {
                spinner.style.display = 'none';
                thumbnail.style.display = 'none';
                videoEl.style.display = 'block';
                videoEl.play().catch(e => console.warn('Video play failed:', e));
            });

            container.appendChild(thumbnail);
            container.appendChild(spinner);
            container.appendChild(videoEl);
            slideArea.appendChild(container);
        } else {
            var videoEl = document.createElement('video');
            videoEl.src = photo.src;
            videoEl.muted = true;
            videoEl.autoplay = true;
            videoEl.loop = true;
            videoEl.playsInline = true;
            videoEl.controls = false;
            videoEl.preload = "metadata";
            videoEl.style.background = '#000';
            Object.assign(videoEl.style, isMobile ? videoStylesMobile : videoStylesDesktop);
            slideArea.appendChild(videoEl);
        }
    } else {
        var img = document.createElement('img');
        img.src = photo.src;
        Object.assign(img.style, photoStyles);
        slideArea.appendChild(img);
    }

    var caption = document.getElementById('caption');
    caption.textContent = photo.caption || '';

    if (slideArea.firstChild) {
        gsap.from(slideArea.firstChild, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' });
    }
}

// =====================
// Modal Controls
// =====================
function openModalForTrip(trip) {
    currentTrip = trip;
    currentIndex = 0;
    var modal = document.getElementById('modal');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    showSlide();
    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.35 });
}

function closeModal() {
    var modal = document.getElementById('modal');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    gsap.to(modal, { opacity: 0, duration: 0.25 });
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
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('nextBtn').addEventListener('click', nextSlide);
    document.getElementById('prevBtn').addEventListener('click', prevSlide);
    document.addEventListener('keydown', function (e) {
        var modal = document.getElementById('modal');
        if (modal.getAttribute('aria-hidden') === 'true') return;
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'Escape') closeModal();
    });
    document.getElementById('modal').addEventListener('click', function (ev) {
        if (ev.target.id === 'modal') closeModal();
    });
}

// =====================
// Loader with Progress Bar
// =====================
function hideLoader() {
    var loader = document.getElementById('loader');
    if (loader) {
        gsap.to(loader, { opacity: 0, duration: 0.5, onComplete: () => loader.style.display = 'none' });
    }
}

function waitForImagesToLoad(containerSelector, callback) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        callback();
        return;
    }

    const images = container.querySelectorAll('img');
    if (images.length === 0) {
        callback();
        return;
    }

    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    let loadedCount = 0;
    const totalImages = images.length;

    function updateProgress() {
        loadedCount++;
        const percent = Math.round((loadedCount / totalImages) * 100);
        progressBar.style.width = percent + '%';
        progressText.textContent = percent + '%';
        if (loadedCount >= totalImages) {
            setTimeout(callback, 300);
        }
    }

    images.forEach((img) => {
        if (img.complete && img.naturalWidth !== 0) {
            updateProgress();
        } else {
            img.addEventListener('load', updateProgress);
            img.addEventListener('error', updateProgress);
        }
    });
}

function waitForSelectedImagesToLoad(imagesList, callback) {
    if (!imagesList || imagesList.length === 0) {
        callback();
        return;
    }

    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    let loadedCount = 0;
    const totalImages = imagesList.length;

    function updateProgress() {
        loadedCount++;
        const percent = Math.round((loadedCount / totalImages) * 100);
        if (progressBar) progressBar.style.width = percent + '%';
        if (progressText) progressText.textContent = percent + '%';
        if (loadedCount >= totalImages) {
            setTimeout(callback, 300);
        }
    }

    imagesList.forEach(src => {
        const img = new Image();
        img.onload = updateProgress;
        img.onerror = updateProgress;
        img.src = src;
    });
}


// =====================
// Init
// =====================
document.addEventListener('DOMContentLoaded', function () {
    renderTrips();
    attachEvents();
    waitForSelectedImagesToLoad(priorityImages, hideLoader);
});
