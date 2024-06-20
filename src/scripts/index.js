import { fetchAlbums } from './api.js';
import { applyInputRangeStyle } from './inputRange.js';

let albumsCache = [];
let selectedGenre = 'Todos';

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function createAlbumCard(album) {
  const albumCard = document.createElement("div");
  albumCard.classList.add("albumCard");

  const img = document.createElement("img");
  img.src = album.img;
  img.alt = album.title;

  const albumCardInfo = document.createElement("div");
  albumCardInfo.classList.add("albumCardInfo");

  const title = document.createElement("h3");
  title.classList.add("albumTitle");
  title.textContent = album.title;

  const albumDetails = document.createElement("div");
  albumDetails.classList.add("albumDetails");

  const band = document.createElement("p");
  band.classList.add("albumName");
  band.textContent = album.band;

  const genre = document.createElement("p");
  genre.classList.add("albumGenre");
  genre.textContent = album.genre;

  albumDetails.append(band, genre);

  const albumPriceButtonContainer = document.createElement("div");
  albumPriceButtonContainer.classList.add("albumPriceButtonContainer");

  const price = document.createElement("p");
  price.classList.add("albumPrice");
  const albumPrice = parseFloat(album.price);
  if (isNaN(albumPrice)) {
    price.textContent = "Preço indisponível";
  } else {
    price.textContent = `R$ ${albumPrice.toFixed(2)}`;
  }

  const buyButton = document.createElement("button");
  buyButton.classList.add("buyButton");
  buyButton.textContent = "Comprar";

  albumPriceButtonContainer.append(price, buyButton);

  albumCardInfo.append(title, albumDetails, albumPriceButtonContainer);
  albumCard.append(img, albumCardInfo);

  return albumCard;
}

function displayAlbums(container, maxPrice, genre) {
  container.innerHTML = ""; 

  albumsCache.forEach((album) => {
    const albumPrice = parseFloat(album.price);
    if (
      (!isNaN(albumPrice) && albumPrice <= maxPrice) &&
      (genre === 'Todos' || album.genre.toLowerCase() === genre.toLowerCase())
    ) { 
      const albumCard = createAlbumCard(album);
      container.appendChild(albumCard);
    }
  });
}

async function loadAlbums(container) {
  try {
    albumsCache = await fetchAlbums();
    const maxPrice = parseFloat(document.getElementById("priceRange").value);
    displayAlbums(container, maxPrice, selectedGenre);
  } catch (error) {
    console.error("Error fetching albums:", error);
    container.innerHTML = "<p>Failed to load albums. Please try again later.</p>";
  }
}

function updatePriceDisplay() {
  const maxPrice = document.getElementById("priceRange").value;
  const priceDisplay = document.querySelector(".priceNum");
  priceDisplay.textContent = `R$ ${parseFloat(maxPrice).toFixed(2)}`;
}

function handleGenreButtonClick(event) {
  selectedGenre = event.target.textContent;
  const albumContainer = document.getElementById("album-container");
  const maxPrice = parseFloat(document.getElementById("priceRange").value);
  displayAlbums(albumContainer, maxPrice, selectedGenre);
}

function addGenreButtonEventListeners() {
  const genreButtons = document.querySelectorAll(".genreButtonContainer button");
  genreButtons.forEach(button => {
    button.addEventListener("click", handleGenreButtonClick);
  });
}

function routine() {
  const albumContainer = document.getElementById("album-container");
  loadAlbums(albumContainer); 

  applyInputRangeStyle();

  const inputRange = document.getElementById("priceRange");
  const debouncedDisplayAlbums = debounce(() => {
    updatePriceDisplay();
    const maxPrice = parseFloat(document.getElementById("priceRange").value);
    displayAlbums(albumContainer, maxPrice, selectedGenre);
  }, 300);

  inputRange.addEventListener("input", debouncedDisplayAlbums);

  updatePriceDisplay();
  addGenreButtonEventListeners();
}

document.addEventListener('DOMContentLoaded', routine);

function toggleTheme() {
  const isDarkMode = document.documentElement.classList.toggle('darkMode');
  const theme = isDarkMode ? 'dark' : 'light';
  localStorage.setItem('@openMusic:theme', theme);
  updateButtonIcon(theme);
}

function updateButtonIcon(theme) {
  const button = document.querySelector('.buttonMode');
  if (theme === 'dark') {
    button.style.backgroundImage = "url('./src/assets/icons/lightmodeicon.svg')";
  } else {
    button.style.backgroundImage = "url('./src/assets/icons/darkmodeicon.svg')";
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem('@openMusic:theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('darkMode');
  } else {
    document.documentElement.classList.remove('darkMode');
  }
  updateButtonIcon(savedTheme);
}

document.querySelector('.buttonMode').addEventListener('click', toggleTheme);
loadTheme();
