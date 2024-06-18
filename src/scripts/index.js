// src/scripts/index.js
import { albumList } from './albumsDatabase.js';
import { applyInputRangeStyle } from './inputRange.js';

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

  const band = document.createElement("p");
  band.classList.add("albumName");
  band.textContent = album.band;

  const genre = document.createElement("p");
  genre.classList.add("albumGenre");
  genre.textContent = album.genre;

  const price = document.createElement("p");
  price.classList.add("albumPrice");
  price.textContent = `R$ ${album.price.toFixed(2)}`;

  const buyButton = document.createElement("button");
  buyButton.classList.add("buyButton");
  buyButton.textContent = "Comprar";

  albumCardInfo.append(title, band, genre, price, buyButton);
  albumCard.append(img, albumCardInfo);

  return albumCard;
}

function displayAlbums(albums, container) {
    container.innerHTML = ""; 
  
    const maxPrice = parseFloat(document.getElementById("priceRange").value); 
  
    albums.forEach((album) => {
      if (album.price <= maxPrice) { 
        const albumCard = createAlbumCard(album);
        container.appendChild(albumCard);
      }
    });
  }
  
  function routine() {
    const albumContainer = document.getElementById("album-container");
    displayAlbums(albumList, albumContainer); 
  
    applyInputRangeStyle(); 
  
    const inputRange = document.getElementById("priceRange");
    inputRange.addEventListener("input", () => {
      displayAlbums(albumList, albumContainer);
    });
  }
  
  document.addEventListener('DOMContentLoaded', routine);