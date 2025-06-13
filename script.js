// Grabbing the buttons
let play_btn = document.getElementById("play");
let prev_btn = document.getElementById("prev");
let next_btn = document.getElementById("next");
let fave_btn = document.getElementById("favorites");
let album = document.querySelector(".album-cover");
let knob = document.querySelector("#volume");
let song_name = document.getElementById("song-name");
let artist_name = document.getElementById("artist-name");
let volume = document.getElementById("volume");

// Grabbing the seek bar elements
const progressBar = document.getElementById('progress-bar');
const progressFilled = document.getElementById('progress-filled');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('total-duration')

// Grabbing the icons
let play_icon = document.querySelector("#play i");
let fave_icon = document.querySelector("#favorites i");

let isPlaying = false;
let isFavorite = false;

// Volume Knob
let isDragging = false;
let currentAngle = 0;

function formatTime(seconds){
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}


// Allow click to seek
progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const seekTime = (clickX / width) * audio.duration;
  audio.currentTime = seekTime;
});

//Constructor function for a specific song;
function Song(name, artist, src, cover) {
  this.name = name;
  this.artist = artist;
  this.src = src;
  this.cover = cover;
}

let SongList = [
  new Song(
    "Kinaaray",
    "Abdul Hannan",
    "assets/song1/music.mp3",
    "assets/song1/cover.png"
  ),
  new Song(
    "Pal Pal",
    "Afusic",
    "assets/song2/music.mp3",
    "assets/song2/cover.png"
  ),
  new Song(
    "back to you",
    "melxnely",
    "assets/song3/music.mp3",
    "assets/song3/cover.png"
  )
];

// Array to store the favorite songs
let faveList =[];

// Audio related
let songCounter = 1;
const audio = new Audio(SongList[songCounter].src);

audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  const percent = (audio.currentTime / audio.duration) * 100;
  progressFilled.style.width = `${percent}%`;
});

song_name.innerText = SongList[songCounter].name;
artist_name.innerText = SongList[songCounter].artist;
audio.src = SongList[songCounter].src;
album.style.backgroundImage = `url(${SongList[songCounter].cover})`;

function updateInfo(songCounter) {
  song_name.innerText = SongList[songCounter].name;
  artist_name.innerText = SongList[songCounter].artist;
  audio.pause();
  audio.src = SongList[songCounter].src;

  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
  }, { once: true }); // <-- important to avoid duplicates!

  album.style.backgroundImage = `url(${SongList[songCounter].cover})`;
  audio.play();
}

// Favorite button actions
fave_btn.addEventListener("click", function () {
  if (!isFavorite) {
    isFavorite = !isFavorite;
    fave_icon.style.transform = "scale(1.3)";
    fave_icon.style.transition = "transform 0.5s ease";
    fave_icon.classList.add("fa-solid");
    fave_icon.classList.remove("fa-regular");
    fave_icon.style.color = "red";
  } else {
    isFavorite = !isFavorite;
    fave_icon.style.transform = "scale(1)";
    fave_icon.style.transition = "transform 0.5s ease";
    fave_icon.classList.add("fa-regular");
    fave_icon.classList.remove("fa-solid");
    fave_icon.style.color = "rgb(130, 130, 130)";
  }
});

// Play button actions
play_btn.addEventListener("click", function () {
  if (!isPlaying) {
    audio.play();
    isPlaying = !isPlaying;
    play_icon.classList.add("fa-pause");
    play_icon.classList.remove("fa-play");
    album.style.transform = "scale(1)";
    album.style.transition = "transform 0.5s ease";
    volume.style.border = "5px solid white"
  } else {
    audio.pause();
    isPlaying = !isPlaying;
    play_icon.classList.add("fa-play");
    play_icon.classList.remove("fa-pause");
    album.style.transform = "scale(0.8)";
    album.style.transition = "transform 0.5s ease";
    volume.style.border = "5px solid lightcoral"
  }
});

// Next Buton actions
next_btn.addEventListener("click", function () {
  songCounter++;
  updateInfo(songCounter);
});

//Prev Button actions
prev_btn.addEventListener("click", function () {
  songCounter--;
  updateInfo(songCounter);
});

function updateRotation(clientX, clientY) {
  const rect = knob.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = clientX - centerX;
  const dy = clientY - centerY;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI); // In degrees
  let adjustedAngle = (angle + 360) % 360;

  // Clamp the angle between 0 and 270 (max rotation)
  if (adjustedAngle > 270) adjustedAngle = 270;
  if (adjustedAngle < 0) adjustedAngle = 0;

  knob.style.transform = `rotate(${adjustedAngle}deg)`;
  audio.volume = adjustedAngle / 270; // Volume from 0 to 1
  currentAngle = adjustedAngle;
}

// Mouse Events
knob.addEventListener("mousedown", () => (isDragging = true));
window.addEventListener("mouseup", () => (isDragging = false));
window.addEventListener("mousemove", (e) => {
  if (isDragging) updateRotation(e.clientX, e.clientY);
});

// Touch Events (for mobile)
knob.addEventListener("touchstart", () => (isDragging = true));
window.addEventListener("touchend", () => (isDragging = false));
window.addEventListener("touchmove", (e) => {
  if (isDragging && e.touches.length === 1) {
    updateRotation(e.touches[0].clientX, e.touches[0].clientY);
  }
});

volume.addEventListener('mouseover', function(){
  volume.style.border = "5px solid lightblue";
})

volume.addEventListener('mouseout', function(){
  if(isPlaying){
    volume.style.border = "5px solid white";
  }else{
    volume.style.border = "5px solid lightcoral";
  }
})