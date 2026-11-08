/* =========================================
   KONFIGURASI UNDANGAN
========================================= */

const CONFIG = {
  weddingDate: "2026-12-13T08:00:00+07:00",

  // GANTI dengan nomor WhatsApp penerima konfirmasi.
  // Gunakan kode negara 62, tanpa tanda + atau angka 0 di depan.
  whatsappNumber: "6281234567890",

  // GANTI dengan link Google Maps lokasi acara.
  mapUrl: "https://maps.google.com/?q=Nama+Tempat+Acara",

  // GANTI dengan nomor rekening yang sebenarnya.
  accountNumber: "123456789012",

  // Nama pemilik rekening.
  accountOwner: "Nama Pemilik Rekening"
};


/* =========================================
   NAMA TAMU DARI LINK UNDANGAN
========================================= */

// Contoh link:
// https://namakamu.github.io/undangan/?to=Keluarga%20Bapak%20Andi

const urlParams = new URLSearchParams(window.location.search);
const guest = urlParams.get("to");

const guestNameElement = document.getElementById("guestName");

if (guest && guestNameElement) {
  guestNameElement.textContent = guest;
}


/* =========================================
   PEMBUKAAN AMPLOP
========================================= */

const openButton = document.getElementById("openInvitation");
const envelope = document.getElementById("envelope");
const envelopeScreen = document.getElementById("envelopeScreen");
const mainInvitation = document.getElementById("mainInvitation");
const floatingTools = document.getElementById("floatingTools");

let invitationOpened = false;

openButton.addEventListener("click", async () => {
  if (invitationOpened) return;

  invitationOpened = true;

  envelope.classList.add("open");

  // Coba putar musik setelah interaksi pengguna.
  playMusic();

  // Beri waktu untuk animasi amplop.
  setTimeout(() => {
    envelopeScreen.classList.add("hidden");
    mainInvitation.classList.add("visible");
    floatingTools.classList.add("visible");

    startSlider();
    observeSections();
  }, 1200);
});


/* =========================================
   COUNTDOWN PERNIKAHAN
========================================= */

const weddingTime = new Date(CONFIG.weddingDate).getTime();

function updateCountdown() {
  const now = Date.now();
  const difference = weddingTime - now;

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  if (difference <= 0) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );
  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );
  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  daysElement.textContent = String(days).padStart(2, "0");
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* =========================================
   SLIDE OTOMATIS
========================================= */

const slides = document.querySelectorAll(".hero-slide");
const indicators = document.querySelectorAll(".indicator");

const slideButton = document.getElementById("slideButton");
const slideIcon = document.getElementById("slideIcon");

let currentSlide = 0;
let sliderInterval = null;
let sliderPaused = false;

const SLIDE_DURATION = 5000;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });

  indicators.forEach((indicator, i) => {
    indicator.classList.toggle("active", i === index);
  });

  currentSlide = index;
}

function nextSlide() {
  const nextIndex = (currentSlide + 1) % slides.length;
  showSlide(nextIndex);
}

function startSlider() {
  if (sliderInterval) {
    clearInterval(sliderInterval);
  }

  if (sliderPaused) return;

  sliderInterval = setInterval(nextSlide, SLIDE_DURATION);
}

function stopSlider() {
  if (sliderInterval) {
    clearInterval(sliderInterval);
    sliderInterval = null;
  }
}

slideButton.addEventListener("click", () => {
  sliderPaused = !sliderPaused;

  if (sliderPaused) {
    stopSlider();
    slideIcon.textContent = "▶";
    slideButton.setAttribute("aria-label", "Lanjutkan slide");
  } else {
    startSlider();
    slideIcon.textContent = "Ⅱ";
    slideButton.setAttribute("aria-label", "Hentikan slide");
  }
});


/* =========================================
   MUSIK UNDANGAN
========================================= */

const weddingMusic = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");

let musicPlaying = false;

async function playMusic() {
  try {
    await weddingMusic.play();
    musicPlaying = true;
    musicIcon.textContent = "♫";
    musicButton.setAttribute("aria-label", "Matikan musik");
  } catch (error) {
    musicPlaying = false;
    musicIcon.textContent = "♪";
    console.log("Musik belum dapat diputar:", error);
  }
}

function pauseMusic() {
  weddingMusic.pause();
  musicPlaying = false;
  musicIcon.textContent = "♪";
  musicButton.setAttribute("aria-label", "Putar musik");
}

musicButton.addEventListener("click", () => {
  if (musicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
});


/* =========================================
   KONFIRMASI KEHADIRAN VIA WHATSAPP
========================================= */

const rsvpForm = document.getElementById("rsvpForm");

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("rsvpName").value.trim();
  const attendance = document.getElementById("attendance").value;
  const guestCount = document.getElementById("guestCount").value;

  if (!name || !attendance) {
    alert("Mohon lengkapi nama dan konfirmasi kehadiran.");
    return;
  }

  const message = `
Assalamualaikum, saya ingin mengonfirmasi kehadiran pada acara pernikahan Suci Rahmawati & Daniel.

Nama: ${name}
Konfirmasi: ${attendance}
Jumlah tamu: ${attendance === "Hadir" ? guestCount + " orang" : "-"}

Terima kasih.
  `.trim();

  const whatsappURL =
    `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank", "noopener,noreferrer");
});


/* =========================================
   SALIN NOMOR REKENING
========================================= */

const copyButton = document.getElementById("copyAccount");

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(CONFIG.accountNumber);

    copyButton.textContent = "Berhasil Disalin ✓";

    setTimeout(() => {
      copyButton.textContent = "Salin Nomor Rekening";
    }, 2000);

  } catch (error) {
    alert("Tidak dapat menyalin otomatis. Nomor rekening: " + CONFIG.accountNumber);
  }
});


/* =========================================
   LINK GOOGLE MAPS
========================================= */

document.getElementById("mapButton").href = CONFIG.mapUrl;


/* =========================================
   ANIMASI SAAT SCROLL
========================================= */

function observeSections() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(element => {
      element.classList.add("show");
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealElements.forEach(element => {
    observer.observe(element);
  });
}


/* =========================================
   FIREBASE - LIVE UCAPAN DAN DOA
========================================= */

// GANTI konfigurasi ini dengan konfigurasi Firebase milikmu.
// Konfigurasi Firebase Web bukan service-account private key.

const firebaseConfig = {
  apiKey: "ISI_API_KEY",
  authDomain: "ISI_PROJECT_ID.firebaseapp.com",
  projectId: "ISI_PROJECT_ID",
  storageBucket: "ISI_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "ISI_MESSAGING_SENDER_ID",
  appId: "ISI_APP_ID"
};

const wishesList = document.getElementById("wishesList");
const wishForm = document.getElementById("wishForm");
const wishSubmit = document.getElementById("wishSubmit");
const wishCount = document.getElementById("wishCount");

let firebaseReady = false;
let addWish = null;

function showFirebaseError(message) {
  wishesList.innerHTML = "";

  const info = document.createElement("p");
  info.className = "empty-wishes";
  info.textContent = message;

  wishesList.appendChild(info);
}

function formatWishDate(timestamp) {
  if (!timestamp) return "Baru saja";

  const date = timestamp.toDate
    ? timestamp.toDate()
    : new Date(timestamp);

  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta"
  });
}

function renderWishes(snapshot) {
  wishesList.innerHTML = "";

  const total = snapshot.size;
  wishCount.textContent = `${total} ucapan`;

  if (total === 0) {
    showFirebaseError("Belum ada ucapan. Jadilah yang pertama mengirim doa!");
    return;
  }

  snapshot.forEach((documentSnapshot) => {
    const data = documentSnapshot.data();

    const item = document.createElement("article");
    item.className = "wish-item";

    const name = document.createElement("strong");
    name.textContent = data.name || "Tamu";

    const message = document.createElement("p");
    message.textContent = data.message || "";

    const time = document.createElement("span");
    time.className = "wish-time";
    time.textContent = formatWishDate(data.createdAt);

    item.appendChild(name);
    item.appendChild(message);
    item.appendChild(time);

    wishesList.appendChild(item);
  });
}

async function initializeFirebase() {
  const isConfigured =
    firebaseConfig.apiKey !== "ISI_API_KEY" &&
    firebaseConfig.projectId !== "ISI_PROJECT_ID" &&
    firebaseConfig.appId !== "ISI_APP_ID";

  if (!isConfigured) {
    showFirebaseError(
      "Ucapan akan tampil setelah Firebase dikonfigurasi."
    );
    wishSubmit.disabled = true;
    wishSubmit.textContent = "Firebase belum dikonfigurasi";
    return;
  }

  try {
    const { initializeApp } = await import(
      "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js"
    );

    const {
      getFirestore,
      collection,
      addDoc,
      onSnapshot,
      query,
      orderBy,
      limit,
      serverTimestamp
    } = await import(
      "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"
    );

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const wishesCollection = collection(db, "wishes");

    const wishesQuery = query(
      wishesCollection,
      orderBy("createdAt", "desc"),
      limit(50)
    );

    addWish = async (name, message) => {
      await addDoc(wishesCollection, {
        name: name,
        message: message,
        createdAt: serverTimestamp()
      });
    };

    onSnapshot(
      wishesQuery,
      renderWishes,
      (error) => {
        console.error("Firebase listener error:", error);
        showFirebaseError(
          "Ucapan belum dapat dimuat. Silakan coba beberapa saat lagi."
        );
      }
    );

    firebaseReady = true;
    wishSubmit.disabled = false;
    wishSubmit.textContent = "Kirim Ucapan";

  } catch (error) {
    console.error("Firebase gagal dijalankan:", error);

    showFirebaseError(
      "Koneksi ucapan belum tersedia. Silakan periksa konfigurasi Firebase."
    );

    wishSubmit.disabled = true;
  }
}


/* =========================================
   KIRIM UCAPAN
========================================= */

wishForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!firebaseReady || !addWish) {
    alert("Fitur ucapan belum siap. Silakan coba lagi nanti.");
    return;
  }

  const name = document.getElementById("wishName").value.trim();
  const message = document.getElementById("wishMessage").value.trim();

  if (!name || !message) {
    alert("Mohon isi nama dan ucapan terlebih dahulu.");
    return;
  }

  if (name.length > 50 || message.length > 500) {
    alert("Nama atau ucapan terlalu panjang.");
    return;
  }

  wishSubmit.disabled = true;
  wishSubmit.textContent = "Mengirim...";

  try {
    await addWish(name, message);

    wishForm.reset();

    wishSubmit.textContent = "Berhasil Dikirim ✓";

    setTimeout(() => {
      wishSubmit.textContent = "Kirim Ucapan";
      wishSubmit.disabled = false;
    }, 2000);

  } catch (error) {
    console.error("Gagal mengirim ucapan:", error);

    alert("Ucapan belum berhasil dikirim. Silakan coba kembali.");

    wishSubmit.disabled = false;
    wishSubmit.textContent = "Kirim Ucapan";
  }
});


/* =========================================
   MULAI FIREBASE
========================================= */

initializeFirebase();