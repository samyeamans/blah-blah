// Client ID and Client Secret from Spotify Developer Dashboard
const clientId = '626b57b8c7d44899ac6a49cc114c7543';
const clientSecret = '8f36a6fff7924ff08dae2f92df41dfc6';

// Get access token from Spotify API (Client Credentials Flow)
function getAccessToken() {
  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = btoa(credentials);

  return fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  .then(response => response.json())
  .then(data => data.access_token)
  .catch(error => {
    console.error('Error getting access token:', error);
    showErrorMessage("Failed to authenticate with Spotify. Please check your connection and try again.");
    return null;
  });
}

// Fetch the moods and genres data from the JSON file
fetch('moods-genres.json')
  .then(response => response.json())
  .then(data => {
    populateDropdown('mood', data.moods);
    populateDropdown('genre', data.genres);
  })
  .catch(error => {
    console.error('Error fetching JSON:', error);
    showErrorMessage("Could not load moods and genres. Please refresh the page.");
  });

// Function to populate the dropdowns dynamically
function populateDropdown(id, items) {
  const dropdown = document.getElementById(id);
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.toLowerCase();
    option.textContent = item;
    dropdown.appendChild(option);
  });
}

// Store the current playlist/song index and the list of results
let currentItemIndex = 0;
let currentResults = [];
let currentType = ''; // 'playlist' or 'song'

// Function to get music (shared code for both songs and playlists)
function getMusic(type, mood, genre) {
  // Show loading state
  const musicResult = document.getElementById('musicResult');
  musicResult.innerHTML = `<p>Looking for the perfect ${type}...</p>`;
  
  // Disable buttons during loading
  document.getElementById('getPlaylist').disabled = true;
  document.getElementById('getSong').disabled = true;
  document.getElementById('nextButton').disabled = true;

  // Set current type
  currentType = type;

  getAccessToken().then(token => {
    if (!token) {
      document.getElementById('getPlaylist').disabled = false;
      document.getElementById('getSong').disabled = false;
      return;
    }
    
    const query = `${mood} ${genre}`;
    const searchType = type === 'playlist' ? 'playlist' : 'track';
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${searchType}&limit=10`;

    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Store results based on type
      if (type === 'playlist') {
        // Filter out playlists with no images to prevent blank displays
        currentResults = data.playlists.items.filter(playlist => 
          playlist && playlist.images && playlist.images.length > 0
        );
      } else {
        // Filter out tracks with no album images
        currentResults = data.tracks.items.filter(track => 
          track && track.album && track.album.images && track.album.images.length > 0
        );
      }
      
      currentItemIndex = 0;  // Reset to first item

      // Re-enable buttons
      document.getElementById('getPlaylist').disabled = false;
      document.getElementById('getSong').disabled = false;
      document.getElementById('nextButton').disabled = currentResults.length <= 1;

      if (currentResults.length === 0) {
        showEmptyResultMessage(mood, genre, type);
      } else {
        displayMusicItem();
      }
    })
    .catch(error => {
      console.error(`Error fetching ${type}:`, error);
      showErrorMessage(`Error fetching ${type}s from Spotify. Please try again later.`);
      document.getElementById('getPlaylist').disabled = false;
      document.getElementById('getSong').disabled = false;
    });
  });
}

// Function to display the current result (either playlist or song)
function displayMusicItem() {
  const musicResult = document.getElementById('musicResult');
  musicResult.innerHTML = '';

  // Safety check - make sure we have valid data
  if (!currentResults || currentResults.length === 0 || currentItemIndex >= currentResults.length) {
    showErrorMessage("No results available.");
    document.getElementById('nextButton').disabled = true;
    return;
  }

  const item = currentResults[currentItemIndex];
  
  // Create container
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('music-item');
  
  if (currentType === 'playlist') {
    // Display playlist
    if (!item || !item.external_urls || !item.name) {
      currentItemIndex = (currentItemIndex + 1) % currentResults.length;
      displayMusicItem(); // Try the next playlist instead
      return;
    }

    const playlistLink = document.createElement('a');
    playlistLink.href = item.external_urls.spotify;
    playlistLink.target = '_blank';

    const playlistName = document.createElement('h3');
    playlistName.textContent = item.name;

    const playlistImage = document.createElement('img');
    // Ensure we have a valid image
    if (item.images && item.images.length > 0 && item.images[0].url) {
      playlistImage.src = item.images[0].url;
    } else {
      playlistImage.src = 'https://via.placeholder.com/150';
    }
    playlistImage.alt = item.name;

    const playlistInfo = document.createElement('p');
    playlistInfo.textContent = `${item.tracks.total} tracks • By ${item.owner.display_name}`;
    playlistInfo.style.fontSize = '12px';
    playlistInfo.style.color = '#b3b3b3';
    playlistInfo.style.marginTop = '5px';

    const counter = document.createElement('p');
    counter.textContent = `Playlist ${currentItemIndex + 1} of ${currentResults.length}`;
    counter.style.fontSize = '12px';
    counter.style.color = '#b3b3b3';
    counter.style.marginTop = '10px';

    playlistLink.appendChild(playlistImage);
    playlistLink.appendChild(playlistName);
    itemDiv.appendChild(playlistLink);
    itemDiv.appendChild(playlistInfo);
    itemDiv.appendChild(counter);
  } else {
    // Display song
    if (!item || !item.external_urls || !item.name) {
      currentItemIndex = (currentItemIndex + 1) % currentResults.length;
      displayMusicItem(); // Try the next song instead
      return;
    }

    itemDiv.classList.add('song-item');
    
    const songLink = document.createElement('a');
    songLink.href = item.external_urls.spotify;
    songLink.target = '_blank';

    const songName = document.createElement('h3');
    songName.textContent = item.name;

    const songImage = document.createElement('img');
    // Get album art
    if (item.album && item.album.images && item.album.images.length > 0) {
      songImage.src = item.album.images[0].url;
    } else {
      songImage.src = 'https://via.placeholder.com/150';
    }
    songImage.alt = item.name;

    // Artist info
    const artistDiv = document.createElement('div');
    artistDiv.classList.add('artist');
    
    const artists = item.artists.map(artist => artist.name).join(', ');
    artistDiv.textContent = `By ${artists} • ${item.album.name}`;

    // Preview if available
    if (item.preview_url) {
      const audioPreview = document.createElement('audio');
      audioPreview.controls = true;
      audioPreview.src = item.preview_url;
      audioPreview.style.width = '100%';
      audioPreview.style.marginTop = '10px';
      itemDiv.appendChild(audioPreview);
    }

    const counter = document.createElement('p');
    counter.textContent = `Song ${currentItemIndex + 1} of ${currentResults.length}`;
    counter.style.fontSize = '12px';
    counter.style.color = '#b3b3b3';
    counter.style.marginTop = '10px';

    songLink.appendChild(songImage);
    songLink.appendChild(songName);
    itemDiv.appendChild(songLink);
    itemDiv.appendChild(artistDiv);
    itemDiv.appendChild(counter);
  }

  musicResult.appendChild(itemDiv);
  
  // Update Next button state
  document.getElementById('nextButton').disabled = currentResults.length <= 1;
}

// Display a message when no results are found
function showEmptyResultMessage(mood, genre, type) {
  const musicResult = document.getElementById('musicResult');
  musicResult.innerHTML = `<p>No ${type}s found for the combination: ${mood} and ${genre}. Please try another combination!</p>`;
  document.getElementById('nextButton').disabled = true;
}

// Show an error message if the fetch fails
function showErrorMessage(message = "There was an error fetching results. Please try again later.") {
  const musicResult = document.getElementById('musicResult');
  musicResult.innerHTML = `<p>${message}</p>`;
}

// Event listener for the "Get Playlist" button
document.getElementById('getPlaylist').addEventListener('click', () => {
  const mood = document.getElementById('mood').value;
  const genre = document.getElementById('genre').value;

  if (mood && genre) {
    getMusic('playlist', mood, genre);
  } else {
    alert('Please select both mood and genre!');
  }
});

// Event listener for the "Get Song" button
document.getElementById('getSong').addEventListener('click', () => {
  const mood = document.getElementById('mood').value;
  const genre = document.getElementById('genre').value;

  if (mood && genre) {
    getMusic('song', mood, genre);
  } else {
    alert('Please select both mood and genre!');
  }
});

// Event listener for the "Next" button
document.getElementById('nextButton').addEventListener('click', () => {
  if (currentResults.length > 0) {
    currentItemIndex = (currentItemIndex + 1) % currentResults.length;  // Move to next item
    displayMusicItem();
  } else {
    alert('Please generate music first!');
  }
});
