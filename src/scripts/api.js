export async function fetchAlbums() {
    const response = await fetch('https://openmusic-fake-api.onrender.com/api/musics');
    if (!response.ok) {
      throw new Error('Failed to fetch albums');
    }
    const albums = await response.json();
    return albums;
  }
  