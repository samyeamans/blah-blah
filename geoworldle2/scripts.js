// GeoWorldle Game Script - Combined Version

// Global variables for maps
let map, panorama, guessMarker, actualPosition;
let challengeLocations = [];
let currentLocationIndex = 0;
let totalDistance = 0;
let guesses = [];
let timerInterval;
let secondsRemaining = 30;
let gameType = 'daily'; // 'daily' or 'challenge'
let guessCount = 0;
let bestGuessDistance = Infinity;
let isGameActive = false;
let shareText = ''; // To store the shareable text

// DOM Elements initialization
document.addEventListener('DOMContentLoaded', function() {
    // Share popup elements
    const sharePopup = document.getElementById('sharePopup');
    const sharePopupOverlay = document.getElementById('sharePopupOverlay');
    const copyResultsBtn = document.getElementById('copyShareBtn');
    const closeShareBtn = document.getElementById('closeSharePopup');
    const shareTextElement = document.getElementById('sharePopupText');

    // Function to copy share text to clipboard
    function copyResultsToClipboard() {
        if (shareText) {
            navigator.clipboard.writeText(shareText).then(() => {
                copyResultsBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyResultsBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                alert('Could not copy to clipboard. Try again.');
            });
        }
    }

    // Function to close share popup
    function closeSharePopup() {
        if (sharePopup && sharePopupOverlay) {
            sharePopup.style.display = 'none';
            sharePopupOverlay.style.display = 'none';
            window.location.reload();
        }
    }

    // Attach event listeners
    if (copyResultsBtn) {
        copyResultsBtn.addEventListener('click', copyResultsToClipboard);
    }
    if (closeShareBtn) {
        closeShareBtn.addEventListener('click', closeSharePopup);
        window.location.reload();
        window.location.reload();
        window.location.reload();
        window.location.reload();



    }

    // Existing game logic follows...
});
    // Navigation and UI elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');

    // Game interface elements
    const gameInterface = document.getElementById('game-interface');
    const playDailyBtn = document.getElementById('play-daily');
    const playDailyCardBtn = document.querySelector('#daily-card .btn-mode');
    const playChallengeBtn = document.getElementById('play-challenge');
    const playChallengeCardBtn = document.querySelector('#challenge-card .btn-mode');
    const exitGameBtn = document.getElementById('exit-game');
    const gameTitle = document.getElementById('game-title');
    const guessCountElem = document.getElementById('guess-count');
    const timerContainer = document.getElementById('timer-container');
    const timerDisplay = document.getElementById('timer');
    const makeGuessBtn = document.getElementById('make-guess');
    const nextLocationBtn = document.getElementById('next-location');

    // Modal elements
    const resultsModal = document.getElementById('results-modal');
    const authModal = document.getElementById('auth-modal');
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const playAgainBtn = document.getElementById('play-again');
    const viewLeaderboardBtn = document.getElementById('view-leaderboard');
    
    // Share buttons
    const copyResultsBtn = document.querySelector('.btn-copy');
    const twitterShareBtn = document.querySelector('.btn-share.twitter');
    const facebookShareBtn = document.querySelector('.btn-share.facebook');

    // Leaderboard elements
    const leaderboardTabBtns = document.querySelectorAll('.leaderboard-tabs .tab-btn');
    const leaderboardTabContents = document.querySelectorAll('.tab-content');

    // Auth modal elements
    const authTabBtns = document.querySelectorAll('.auth-tabs .tab-btn');
    const authForms = document.querySelectorAll('.auth-form');

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            authButtons.classList.toggle('show');
        });
    }

    // Game mode buttons
    if (playDailyBtn) {
        playDailyBtn.addEventListener('click', function() {
            startGame('daily');
        });
    }

    if (playDailyCardBtn) {
        playDailyCardBtn.addEventListener('click', function() {
            startGame('daily');
        });
    }

    if (playChallengeBtn) {
        playChallengeBtn.addEventListener('click', function() {
            startGame('challenge');
        });
    }

    if (playChallengeCardBtn) {
        playChallengeCardBtn.addEventListener('click', function() {
            startGame('challenge');
        });
    }

    // Exit game button
    if (exitGameBtn) {
        exitGameBtn.addEventListener('click', function() {
            confirmExit();
        });
    }

    // Make guess button
    if (makeGuessBtn) {
        makeGuessBtn.addEventListener('click', function() {
            if (guessMarker && guessMarker.getVisible()) {
                submitGuess();
            } else {
                alert('Please click on the map to place your guess first');
            }
        });
    }

    // Next location button
    if (nextLocationBtn) {
        nextLocationBtn.addEventListener('click', function() {
            nextLocation();
        });
    }

    // Copy results button
    if (copyResultsBtn) {
        copyResultsBtn.addEventListener('click', function() {
            copyResultsToClipboard();
        });
    }

    // Twitter share button
    if (twitterShareBtn) {
        twitterShareBtn.addEventListener('click', function() {
            shareOnTwitter();
        });
    }

    // Facebook share button
    if (facebookShareBtn) {
        facebookShareBtn.addEventListener('click', function() {
            shareOnFacebook();
        });
    }

    // Modal buttons
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            openAuthModal('login');
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            openAuthModal('signup');
        });
    }

    // Close modal buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeModal(this.closest('.modal'));
        });
    });

    // Play again button
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', function() {
            closeModal(resultsModal);
            window.location.reload();
            startGame(gameType);
            


        });
    }

    // View leaderboard button
    if (viewLeaderboardBtn) {
        viewLeaderboardBtn.addEventListener('click', function() {
            closeModal(resultsModal);
            document.getElementById('leaderboards').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Leaderboard tabs
    leaderboardTabBtns.forEach(tab => {
        tab.addEventListener('click', function() {
            leaderboardTabBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            leaderboardTabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(this.getAttribute('data-tab') + '-leaderboard').classList.add('active');
        });
    });

    // Auth modal tabs
    authTabBtns.forEach(tab => {
        tab.addEventListener('click', function() {
            authTabBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            authForms.forEach(form => form.classList.remove('active'));
            document.getElementById(this.getAttribute('data-tab') + '-form').classList.add('active');
            document.getElementById('auth-title').textContent = this.textContent;
        });
    });

    // Setup difficulty buttons if they exist
    const difficultyButtons = document.querySelectorAll('.btn-difficulty');
    if (difficultyButtons.length > 0) {
        difficultyButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                difficultyButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.textContent = 'Select';
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                this.textContent = 'Selected';
                
                // Update difficulty setting
                // This would affect the timer duration, location selection, etc.
            });
        });
    }

    // Functions

    function startGame(mode) {
        gameType = mode;
        guessCount = 0;
        guesses = [];
        isGameActive = true;
        bestGuessDistance = Infinity;
        totalDistance = 0;

        // Hide placeholders
        const placeholders = document.querySelectorAll('.street-view-placeholder, .map-placeholder');
        placeholders.forEach(placeholder => {
            if (placeholder) placeholder.style.display = 'none';
        });

        if (mode === 'daily') {
            gameTitle.textContent = 'Daily Challenge';
            if (timerContainer) timerContainer.style.display = 'block';
            if (nextLocationBtn) nextLocationBtn.style.display = 'none';
            initializeDailyChallenge();
        } else if (mode === 'challenge') {
            gameTitle.textContent = '10 Location Challenge';
            if (timerContainer) timerContainer.style.display = 'block';
            if (nextLocationBtn) nextLocationBtn.style.display = 'inline-block';
            initializeChallengeMode();
        }

        if (gameInterface) gameInterface.style.display = 'block';
        
        // Update UI elements
        if (guessCountElem) {
            guessCountElem.textContent = `0/${mode === 'daily' ? 3 : 1}`;
        }
        
        if (document.getElementById('best-score')) {
            document.getElementById('best-score').textContent = '0 mi';
        }
        
        if (document.getElementById('total-distance')) {
            document.getElementById('total-distance').textContent = '0 mi';
        }
        
        // Initialize maps after Google Maps API loads
        if (typeof google !== 'undefined' && google.maps) {
            initMaps();
        }
    }

    function confirmExit() {
        if (isGameActive) {
            if (confirm("Are you sure you want to exit the game? Your progress will be lost.")) {
                isGameActive = false;
                clearInterval(timerInterval);
                window.location.href = 'index.html';
            }
        } else {
            window.location.href = 'index.html';
        }
    }

    function openAuthModal(type) {
        if (authModal) {
            authModal.style.display = 'block';
            document.querySelector(`[data-tab="${type}"]`).click();
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
        }
    }


// Initialize the maps for the appropriate game type
function initMaps() {
    // Determine the game type based on the current page
    if (window.location.pathname.includes('daily.html')) {
        gameType = 'daily';
    } else if (window.location.pathname.includes('challenge.html')) {
        gameType = 'challenge';
    } else if (document.getElementById('game-interface') && 
              document.getElementById('game-interface').style.display === 'block') {
        // We're on the main page but the game interface is showing
        // gameType should already be set by startGame()
    } else {
        // On the main page, don't initialize the game interface yet
        return;
    }

    // Initialize the game interface
    initializeGameInterface();
    
    // Select appropriate initialization function based on game type
    if (gameType === 'daily') {
        initializeDailyChallenge();
    } else if (gameType === 'challenge') {
        initializeChallengeMode();
    }
}

// Initialize the game interface
function initializeGameInterface() {
    const mapContainer = document.getElementById('map-container');
    const streetViewContainer = document.getElementById('street-view');
    
    if (!mapContainer || !streetViewContainer) return;
    
    // Create the map
    map = new google.maps.Map(mapContainer, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite']
        }
    });
    
    // Add click event for guessing
    map.addListener('click', function(event) {
        placeGuessMarker(event.latLng);
    });
    
    // Create placeholder panorama (will be updated with actual location)
    panorama = new google.maps.StreetViewPanorama(
        streetViewContainer,
        {
            position: { lat: 0, lng: 0 },
            pov: { heading: 0, pitch: 0 },
            zoom: 1,
            addressControl: false,
            showRoadLabels: false,
            linksControl: false, // Prevent moving from the spot
            panControl: true,
            enableCloseButton: false,
            fullscreenControl: false
        }
    );
    disableStreetViewMovement(panorama);

    // Hide the loading overlay if it exists
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
    
    // Initialize marker for user's guess (hidden initially)
    guessMarker = new google.maps.Marker({
        map: map,
        visible: false,
        icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
    });
    
    // Remove any placeholder elements
    const placeholders = document.querySelectorAll('.street-view-placeholder, .map-placeholder');
    placeholders.forEach(placeholder => {
        if (placeholder) placeholder.style.display = 'none';
    });
}

// Initialize the Daily Challenge
function initializeDailyChallenge() {
    // Reset game state
    guessCount = 0;
    bestGuessDistance = Infinity;
    guesses = [];
    
    // Update UI
    const guessCountElem = document.getElementById('guess-count');
    if (guessCountElem) guessCountElem.textContent = `${guessCount}/3` ;
    
    const bestScoreElem = document.getElementById('best-score');
    if (bestScoreElem) bestScoreElem.textContent = '0 mi';
    
    const makeGuessBtn = document.getElementById('make-guess');
    if (makeGuessBtn) makeGuessBtn.disabled = true;
    
    const nextLocationBtn = document.getElementById('next-location');
    if (nextLocationBtn) nextLocationBtn.style.display = 'none';
    
    // Generate today's location based on the date
    const dailyLocation = getDailyLocation();
    actualPosition = dailyLocation;
    
    // Load the Street View panorama at this location
    loadStreetViewPanorama(dailyLocation);
}

// Initialize the 10 Location Challenge
function initializeChallengeMode() {
    // Reset game state
    currentLocationIndex = 0;
    totalDistance = 0;
    challengeLocations = [];
    guesses = [];
    
    // Update UI
    const locationCountElem = document.getElementById('location-count');
    if (locationCountElem) locationCountElem.textContent = `1/10`;
    
    const totalDistanceElem = document.getElementById('total-distance');
    if (totalDistanceElem) totalDistanceElem.textContent = '0 mi';
    
    const makeGuessBtn = document.getElementById('make-guess');
    if (makeGuessBtn) makeGuessBtn.disabled = true;
    
    const nextLocationBtn = document.getElementById('next-location');
    if (nextLocationBtn) {
        nextLocationBtn.disabled = true;
        nextLocationBtn.style.display = 'inline-block';
    }
    // Show loading overlay
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
    
    // Generate 10 random locations
    generateChallengeLocations(10, function() {
        // Load the first location
        loadChallengeLocation(0);
        
        // Start the timer
        startTimer();
    });
}

// Generate a daily location based on the current date
function getDailyLocation() {
    // Get today's date in UTC
    const today = new Date();
    const dateString = `${today.getUTCFullYear()}-${today.getUTCMonth() + 1}-${today.getUTCDate()}`;
    
    // Use the date string to seed a pseudo-random number generator
    const seed = hashString(dateString);
    const random = seededRandom(seed);
    
    // Generate a random location that's likely to have Street View coverage
    // More populated areas have better Street View coverage
    
    // First, decide if we're showing an urban or rural area
    const isUrban = random() < 0.7; // 70% chance of urban area
    
    let lat, lng;
    if (isUrban) {
        // Urban areas - higher chance of major cities
        const majorCities = [
            {lat: 40.7128, lng: -74.0060},  // New York
            {lat: 51.5074, lng: -0.1278},   // London
            {lat: 35.6762, lng: 139.6503},  // Tokyo
            {lat: 48.8566, lng: 2.3522},    // Paris
            {lat: 37.7749, lng: -122.4194}, // San Francisco
            {lat: 55.7558, lng: 37.6173},   // Moscow
            {lat: 19.4326, lng: -99.1332},  // Mexico City
            {lat: -33.8688, lng: 151.2093}, // Sydney
            {lat: 1.3521, lng: 103.8198},   // Singapore
            {lat: 41.9028, lng: 12.4964},   // Rome
            {lat: 31.2304, lng: 121.4737},  // Shanghai
            {lat: 25.2048, lng: 55.2708},   // Dubai
            {lat: -34.6037, lng: -58.3816}, // Buenos Aires
            {lat: -22.9068, lng: -43.1729}, // Rio de Janeiro
            {lat: 28.6139, lng: 77.2090},   // New Delhi
        ];
        
        // Choose a random major city
        const randomCity = majorCities[Math.floor(random() * majorCities.length)];
        
        // Add some randomness within ~10km of the city center
        const latOffset = (random() - 0.5) * 0.1;
        const lngOffset = (random() - 0.5) * 0.1;
        
        lat = randomCity.lat + latOffset;
        lng = randomCity.lng + lngOffset;
    } else {
        // Rural areas - completely random but away from poles
        lat = (random() * 140 - 70); // -70 to 70 degrees latitude
        lng = random() * 360 - 180;  // -180 to 180 degrees longitude
    }
    
    // Check for Street View coverage and adjust if needed
    findNearbyStreetView({lat, lng}, 5000, function(position) {
        if (position) {
            // We found Street View coverage nearby
            actualPosition = position;
            panorama.setPosition(position);
        } else {
            // Fallback to a location we know has coverage
            const fallbackLocations = [
                {lat: 40.7580, lng: -73.9855}, // Times Square, NY
                {lat: 48.8584, lng: 2.2945},   // Eiffel Tower, Paris
                {lat: 51.5007, lng: -0.1246},  // Big Ben, London
                {lat: 37.8199, lng: -122.4783} // Golden Gate Bridge, SF
            ];
            const fallback = fallbackLocations[Math.floor(random() * fallbackLocations.length)];
            actualPosition = fallback;
            panorama.setPosition(fallback);
        }
    });
    
    return {lat, lng};
}

// Generate random challenge locations
function generateChallengeLocations(count, callback) {
    const locations = [];
    let locationsFound = 0;
    
    function attemptLocationGeneration() {
        if (locationsFound >= count) {
            challengeLocations = locations;
            callback();
            return;
        }
        
        // Generate a random location
        const lat = (Math.random() * 140 - 70); // -70 to 70 degrees latitude
        const lng = Math.random() * 360 - 180;  // -180 to 180 degrees longitude
        
        // Check for Street View coverage
        findNearbyStreetView({lat, lng}, 5000, function(position) {
            if (position) {
                locations.push(position);
                locationsFound++;
            }
            
            // Continue generating locations
            attemptLocationGeneration();
        });
    }
    
    // Start the location generation process
    attemptLocationGeneration();
}

// Load a challenge location by index
function loadChallengeLocation(index) {
    if (index >= challengeLocations.length) {
        // End of challenge
        endGame();
        return;
    }
    
    // Update current index
    currentLocationIndex = index;
    
    // Update UI
    const locationCountElem = document.getElementById('location-count');
    if (locationCountElem) locationCountElem.textContent = `${index + 1}/10`;
    
    // Reset the guess marker
    if (guessMarker) {
    }
    // Show loading overlay
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
    // Load the panorama
    actualPosition = challengeLocations[index];
    panorama.setPosition(actualPosition);
    disableStreetViewMovement(panorama);

    
    // Reset the map view
    map.setCenter({lat: 0, lng: 0});
    map.setZoom(2);
    
    // Reset and start the timer
    resetTimer();
    startTimer();
    
    // Enable/disable buttons
    const makeGuessBtn = document.getElementById('make-guess');
    if (makeGuessBtn) makeGuessBtn.disabled = true;
    
    const nextLocationBtn = document.getElementById('next-location');
    if (nextLocationBtn) nextLocationBtn.disabled = true;
}

// Find a Street View panorama near the given location
function findNearbyStreetView(location, radius, callback) {
    const streetViewService = new google.maps.StreetViewService();
    
    streetViewService.getPanorama({
        location: location,
        radius: radius,
        source: google.maps.StreetViewSource.OUTDOOR
    }, function(data, status) {
        if (status === google.maps.StreetViewStatus.OK) {
            callback(data.location.latLng);
        } else {
            callback(null);
        }
    });
}

// Load a Street View panorama at the given location
function loadStreetViewPanorama(location) {
    const streetViewService = new google.maps.StreetViewService();
    
    streetViewService.getPanorama({
        location: location,
        radius: 5000,
        source: google.maps.StreetViewSource.OUTDOOR
    }, function(data, status) {
        if (status === google.maps.StreetViewStatus.OK) {
            // Set the panorama position
            panorama.setPosition(data.location.latLng);
            disableStreetViewMovement(panorama);

            // Set a random heading
            const randomHeading = Math.floor(Math.random() * 360);
            panorama.setPov({
                heading: randomHeading,
                pitch: 0
            });
            
            // Store the actual position
            actualPosition = data.location.latLng;
            disableStreetViewMovement(panorama);

            panorama.setOptions({
                linksControl: false,
                clickToGo: false,
                motionTracking: false,
                motionTrackingControl: false
            });
        } else {
            // Fallback if no Street View found
            const fallbackLocations = [
                {lat: 40.7580, lng: -73.9855}, // Times Square, NY
                {lat: 48.8584, lng: 2.2945},   // Eiffel Tower, Paris
                {lat: 51.5007, lng: -0.1246},  // Big Ben, London
                {lat: 37.8199, lng: -122.4783} // Golden Gate Bridge, SF
            ];
            const fallback = fallbackLocations[Math.floor(Math.random() * fallbackLocations.length)];
            panorama.setPosition(fallback);
            actualPosition = fallback;
            disableStreetViewMovement(panorama);

        }
    });
}

// Place a marker for the user's guess
function placeGuessMarker(location) {
    // Place/move the marker
    guessMarker.setPosition(location);
    guessMarker.setVisible(true);
    
    // Enable the guess button
    const makeGuessBtn = document.getElementById('make-guess');
    if (makeGuessBtn) makeGuessBtn.disabled = false;
}

// Submit a guess
function submitGuess() {
    // Get the guess position
    const guessPosition = guessMarker.getPosition();
    
    // Calculate distance to actual position
    const distance = calculateDistance(guessPosition, actualPosition);
    
    // Store the guess
    const guessInfo = {
        position: guessPosition,
        distance: distance,
        location: getLocationName(guessPosition)
    };
    guesses.push(guessInfo);
    
    if (gameType === 'daily') {
        // Daily challenge logic
        guessCount++;
        if (gameType === 'daily') {
            // Existing daily challenge logic...
            
            // Check if game is over (all 3 guesses used)
            if (guessCount >= 3) {
                // Stop the timer
                clearInterval(timerInterval);
                
                // Rest of existing game over logic...
            } else {
                // Existing reset for next guess logic...
                
                // Reset the timer for the next guess
                resetTimer();
                startTimer();
            }
        }
        
        const guessCountElem = document.getElementById('guess-count');
        if (guessCountElem) guessCountElem.textContent = `${guessCount}/3`;
        
        // Calculate distance and update best score
        if (distance < bestGuessDistance) {
            bestGuessDistance = distance;
            const bestScoreElem = document.getElementById('best-score');
            if (bestScoreElem) bestScoreElem.textContent = `${Math.round(bestGuessDistance)} mi`;
        }
        
        // Check if game is over (all 3 guesses used)
        if (guessCount >= 3) {
            // Only show the actual location after all 3 guesses
            new google.maps.Marker({
                position: actualPosition,
                map: map,
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                }
            });
            
            // Draw a line between last guess and actual location
            new google.maps.Polyline({
                path: [guessPosition, actualPosition],
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: map
            });
            
            // Zoom to show both markers
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(guessPosition);
            bounds.extend(actualPosition);
            map.fitBounds(bounds);
            
            // Game over - show results
            setTimeout(function() {
                showResults();
                showSharePopup();
            }, 1500);
        } else {
            // Reset for next guess
            guessMarker.setVisible(false);
            
            const makeGuessBtn = document.getElementById('make-guess');
            if (makeGuessBtn) makeGuessBtn.disabled = true;
            
            // Provide feedback without showing actual location
            alert(`Your guess was ${Math.round(distance)} mi away. You have ${3-guessCount} guesses remaining.`);
            
            // Reset the map view for the next guess
            map.setCenter({lat: 0, lng: 0});
            map.setZoom(2);
        }
    } else if (gameType === 'challenge') {
        // Challenge mode logic
        // Add the distance to the total
        totalDistance += distance;
        
        // Update UI
        const totalDistanceElem = document.getElementById('total-distance');
        if (totalDistanceElem) totalDistanceElem.textContent = `${Math.round(totalDistance)} mi`;
        
        // Show actual location and draw line
        new google.maps.Marker({
            position: actualPosition,
            map: map,
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
            }
        });
        
        new google.maps.Polyline({
            path: [guessPosition, actualPosition],
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: map
        });
        
        // Zoom to show both markers
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(guessPosition);
        bounds.extend(actualPosition);
        map.fitBounds(bounds);
        
        // Stop the timer
        clearInterval(timerInterval);
        
        // Check if it's the last location
        if (currentLocationIndex >= 9) {
            // Game over - show results
            setTimeout(function() {
                showResults();
                showSharePopup();
            }, 1500);
        } else {
            // Enable the next location button
            const nextLocationBtn = document.getElementById('next-location');
            if (nextLocationBtn) nextLocationBtn.disabled = false;
        }
    }
}

// Move to the next location in challenge mode
function nextLocation() {
   // Show loading overlay
   const loadingOverlay = document.querySelector('.loading-overlay');
   if (loadingOverlay) {
       loadingOverlay.style.display = 'flex';
   }
    // Move to the next location
    loadChallengeLocation(currentLocationIndex + 1);
}

// Calculate distance between two points in kilometers
function calculateDistance(p1, p2) {
    const R = 3958.8; // Earth's radius in mi 6371
    const dLat = degToRad(p2.lat() - p1.lat());
    const dLon = degToRad(p2.lng() - p1.lng());
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(degToRad(p1.lat())) * Math.cos(degToRad(p2.lat())) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
}

// Convert degrees to radians
function degToRad(deg) {
    return deg * (Math.PI/180);
}

// Get a location name based on coordinates
function getLocationName(position) {
    // This is a placeholder - ideally you would use the Google Maps Geocoding API
    // to get the actual location name
    return ``;
}

// Show the results modal
function showResults() {
    const resultsModal = document.getElementById('results-modal');
    if (!resultsModal) return;
    
    // Update the results modal content
    if (gameType === 'daily') {
        document.querySelector('#results-modal h3').textContent = 'Daily Challenge Complete!';
        document.querySelector('#results-modal .score-label').textContent = 'Your best guess:';
        document.querySelector('#final-score').textContent = `${Math.round(bestGuessDistance)} mi`;
        
        // Create share text for daily challenge
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        shareText = `I was ${Math.round(bestGuessDistance)} mi away on today's GeoWorlder daily challenge! (${dateStr})`;
    } else {
        document.querySelector('#results-modal h3').textContent = 'Challenge Complete!';
        document.querySelector('#results-modal .score-label').textContent = 'Total Distance:';
        document.querySelector('#final-score').textContent = `${Math.round(totalDistance)} mi`;
        
        // Create share text for 10 location challenge
        shareText = `I finished the GeoWorlder 10 locations challenge with a total of ${Math.round(totalDistance)} mi!`;

    }
    
    // Populate guess history
    const guessList = document.getElementById('guess-list');
    if (guessList) {
        guessList.innerHTML = '';
        
        guesses.forEach((guess, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="guess-number">${index + 1}</span>
                <span class="guess-location">${guess.location}</span>
                <span class="guess-distance">${Math.round(guess.distance)} mi</span>
            `;
            guessList.appendChild(li);
        });
    }
    
    // Show the modal
    resultsModal.style.display = 'block';
}

// Copy results to clipboard
function copyResultsToClipboard() {
    if (!shareText) return;
    
    // Try to use the clipboard API
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText)
            .then(() => {
                // Provide feedback
                const copyBtn = document.querySelector('.btn-copy');
                if (copyBtn) {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                }
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
                alert('Could not copy to clipboard. Your browser may not support this feature.');
            });
    } else {
        // Fallback method
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                const copyBtn = document.querySelector('.btn-copy');
                if (copyBtn) {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                }
            } else {
                alert('Could not copy to clipboard. Your browser may not support this feature.');
            }
        } catch (err) {
            console.error('Could not copy text: ', err);
            alert('Could not copy to clipboard. Your browser may not support this feature.');
        }
        
        document.body.removeChild(textArea);
    }
}

// Share results on Twitter
function shareOnTwitter() {
    if (!shareText) return;
    
    const twitterText = encodeURIComponent(shareText + ' Play GeoWorlder today!');
    const twitterURL = `https://twitter.com/intent/tweet?text=${twitterText}`;
    
    window.open(twitterURL, '_blank');
}

// Share results on Facebook
function shareOnFacebook() {
    if (!shareText) return;
    
    // Facebook sharing requires a URL, so we're just sharing the website
    const fbURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareText)}`;
    
    window.open(fbURL, '_blank');
}

// Show share popup after game completion
// Show share popup after game completion
// Show share popup after game completion
// Show share popup after game completion
function showSharePopup() {
    // Check if our custom popup exists, otherwise create it
    let popupOverlay = document.getElementById('sharePopupOverlay');
    let sharePopup = document.getElementById('sharePopup');
    
    // Get current date in a readable format
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Initialize share text and popup content based on game type
    let popupContent = '';
    let popupTitle = '';
    
    if (gameType === 'daily') {
        // For Daily Challenge
        popupTitle = 'Daily Challenge Complete!';
        
        // Find best guess
        let bestGuessInfo = {
            distance: bestGuessDistance,
            guessNumber: guessCount,
        };
        
        // Process guesses to find guess number with best distance
        if (guesses && guesses.length > 0) {
            guesses.forEach((guess, index) => {
                if (guess.distance === bestGuessDistance) {
                    bestGuessInfo.guessNumber = index + 1;
                }
            });
        }
        
        // Create popup content for daily challenge
        popupContent = `
            <p><strong>Best Guess:</strong> <span class="best-value">${Math.round(bestGuessDistance)} mi</span></p>
            <p><strong>Total Guesses:</strong> ${guessCount}/3</p>
            <p><strong>Date:</strong> ${dateStr}</p>
        `;
        
        // Set share text for daily challenge
        shareText = `🌎 My GeoWorlder daily challenge result for ${dateStr} was ${Math.round(bestGuessDistance)} mi away! 🌎
Try it yourself at GeoWorlder.com`;
        
    } else {
        // For 10 Location Challenge
        popupTitle = '10 Location Challenge Complete!';
        
        // Find best and worst guesses
        let bestGuess = { distance: Infinity, location: "Unknown" };
        let worstGuess = { distance: 0, location: "Unknown" };
        
        // Only process guesses if array exists and has items
        if (guesses && guesses.length > 0) {
            // Find best and worst guesses
            guesses.forEach((guess, index) => {
                // Update best guess (lowest distance)
                if (guess.distance < bestGuess.distance) {
                    bestGuess = {
                        distance: guess.distance,
                        location: guess.location || `Location ${index + 1}`,
                        index: index + 1
                    };
                }
                
                // Update worst guess (highest distance)
                if (guess.distance > worstGuess.distance) {
                    worstGuess = {
                        distance: guess.distance,
                        location: guess.location || `Location ${index + 1}`,
                        index: index + 1
                    };
                }
            });
        }
        
        // If no guesses were found, set default values
        if (bestGuess.distance === Infinity) {
            bestGuess = { distance: 0, location: "N/A", index: 0 };
        }
        
        if (worstGuess.distance === 0 && guesses && guesses.length > 0) {
            worstGuess = bestGuess; // Set to best if we couldn't find a worst (shouldn't happen)
        }
        
        // Create popup content for 10 location challenge
        popupContent = `
            <p><strong>Total Distance:</strong> ${Math.round(totalDistance)} mi</p>
            <p><strong>Best Guess:</strong> <span class="best-value">${Math.round(bestGuess.distance)} mi</span> (${bestGuess.location})</p>
            <p><strong>Worst Guess:</strong> <span class="worst-value">${Math.round(worstGuess.distance)} mi</span> (${worstGuess.location})</p>
        `;
        
        // Set share text for 10 location challenge
        shareText = `🌎 I completed GeoWorlder's 10 Locations Challenge with a total of ${Math.round(totalDistance)} mi! 🌎
Best Guess: ${Math.round(bestGuess.distance)} mi
Worst Guess: ${Math.round(worstGuess.distance)} mi
Try it yourself at GeoWorlder.com`;
    }
    
    if (!popupOverlay) {
        // Create overlay
        popupOverlay = document.createElement('div');
        popupOverlay.id = 'sharePopupOverlay';
        popupOverlay.className = 'custom-popup-overlay';
        document.body.appendChild(popupOverlay);
    }
    
    if (!sharePopup) {
        // Create popup
        sharePopup = document.createElement('div');
        sharePopup.id = 'sharePopup';
        sharePopup.className = 'custom-popup';
        
        // Create popup HTML structure
        sharePopup.innerHTML = `
            <div class="custom-popup-icon">
                <i class="fas fa-trophy"></i>
            </div>
            <div class="custom-popup-title">${popupTitle}</div>
            <div class="custom-popup-message">
                ${popupContent}
            </div>
            <div class="share-buttons">
                <button class="btn btn-share twitter"><i class="fab fa-twitter"></i></button>
                <button class="btn btn-share facebook"><i class="fab fa-facebook-f"></i></button>
                <button class="btn btn-copy"><i class="fas fa-copy"></i> Copy</button>
            </div>
            <button class="custom-popup-button" id="closeSharePopup">Play Again</button>
        `;
        
        document.body.appendChild(sharePopup);
        
        // Add event listeners
        const closeBtn = document.getElementById('closeSharePopup');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                popupOverlay.style.display = 'none';
                sharePopup.style.display = 'none';
                window.location.reload();
            });
        }
        
        const copyBtn = sharePopup.querySelector('.btn-copy');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareText)
                        .then(function() {
                            // Show visual feedback that text was copied
                            const originalText = copyBtn.innerHTML;
                            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                            setTimeout(function() {
                                copyBtn.innerHTML = originalText;
                            }, 2000);
                        })
                        .catch(function(err) {
                            console.error('Copy failed:', err);
                            alert('Could not copy to clipboard. Try again.');
                        });
                } else {
                    // Fallback for browsers that don't support clipboard API
                    const textArea = document.createElement('textarea');
                    textArea.value = shareText;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-9999px';
                    textArea.style.top = '0';
                    document.body.appendChild(textArea);
                    
                    try {
                        textArea.focus();
                        textArea.select();
                        const successful = document.execCommand('copy');
                        if (successful) {
                            const originalText = copyBtn.innerHTML;
                            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                            setTimeout(function() {
                                copyBtn.innerHTML = originalText;
                            }, 2000);
                        } else {
                            alert('Could not copy to clipboard. Try again.');
                        }
                    } catch (err) {
                        console.error('execCommand error:', err);
                        alert('Could not copy to clipboard. Try again.');
                    } finally {
                        document.body.removeChild(textArea);
                    }
                }
            });
        }
        
        const twitterBtn = sharePopup.querySelector('.btn-share.twitter');
        if (twitterBtn) {
            twitterBtn.addEventListener('click', function() {
                shareOnTwitter();
            });
        }
        
        const facebookBtn = sharePopup.querySelector('.btn-share.facebook');
        if (facebookBtn) {
            facebookBtn.addEventListener('click', function() {
                shareOnFacebook();
            });
        }
    } else {
        // Update existing popup
        const popupTitleElement = sharePopup.querySelector('.custom-popup-title');
        if (popupTitleElement) {
            popupTitleElement.textContent = popupTitle;
        }
        
        const popupMessageElement = sharePopup.querySelector('.custom-popup-message');
        if (popupMessageElement) {
            popupMessageElement.innerHTML = popupContent;
        }
    }
    
    // Show the popup
    popupOverlay.style.display = 'block';
    sharePopup.style.display = 'block';
}

// Share functions remain the same
function shareOnTwitter() {
    if (!shareText) return;
    
    const twitterText = encodeURIComponent(shareText + ' Play GeoWorlder today!');
    const twitterURL = `https://twitter.com/intent/tweet?text=${twitterText}`;
    
    window.open(twitterURL, '_blank');
}

function shareOnFacebook() {
    if (!shareText) return;
    
    const fbURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareText)}`;
    
    window.open(fbURL, '_blank');
}

// Share functions remain the same
function shareOnTwitter() {
    if (!shareText) return;
    
    const twitterText = encodeURIComponent(shareText + ' Play GeoWorlder today!');
    const twitterURL = `https://twitter.com/intent/tweet?text=${twitterText}`;
    
    window.open(twitterURL, '_blank');
}

function shareOnFacebook() {
    if (!shareText) return;
    
    const fbURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareText)}`;
    
    window.open(fbURL, '_blank');
}

// Enhanced version of shareOnTwitter to include best/worst guesses
function shareOnTwitter() {
    if (!shareText) return;
    
    // For Twitter, we might need to shorten the text due to character limits
    const twitterText = encodeURIComponent(shareText + ' Play GeoWorlder today!');
    const twitterURL = `https://twitter.com/intent/tweet?text=${twitterText}`;
    
    window.open(twitterURL, '_blank');
}

// Enhanced version of shareOnFacebook to include best/worst guesses
function shareOnFacebook() {
    if (!shareText) return;
    
    // Facebook sharing requires a URL
    const fbURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareText)}`;
    
    window.open(fbURL, '_blank');
}

// Start the timer for challenge mode
function startTimer() {
    const timerElem = document.getElementById('timer');
    if (!timerElem) return;
    
    clearInterval(timerInterval);
    secondsRemaining = gameType === 'daily' ? 60 : 30;
    timerElem.textContent = secondsRemaining;
    
    // Update progress bar if it exists
    const progressBar = document.querySelector('.countdown-indicator div');
    if (progressBar) {
        progressBar.style.width = '100%';
    }
    
    // Update the timer every second
    timerInterval = setInterval(function() {
        secondsRemaining--;
        timerElem.textContent = secondsRemaining;
        
        // Update progress bar if it exists
        if (progressBar) {
            const timerDuration = gameType === 'daily' ? 60 : 30;
            const percentRemaining = (secondsRemaining / 30) * 100;
            progressBar.style.width = `${percentRemaining}%`;
        }
        
        if (secondsRemaining <= 0) {
            // Time's up
            clearInterval(timerInterval);
            
            // If no guess was made, make a random guess
            if (!guessMarker.getVisible()) {
                const randomLat = Math.random() * 140 - 70;
                const randomLng = Math.random() * 360 - 180;
                const randomPosition = new google.maps.LatLng(randomLat, randomLng);
                placeGuessMarker(randomPosition);
                submitGuess();
            }
        }
    }, 1000);
}

// Reset the timer
function resetTimer() {
    const timerElem = document.getElementById('timer');
    if (!timerElem) return;
    
    clearInterval(timerInterval);
    secondsRemaining = gameType === 'daily' ? 60 : 30;
    timerElem.textContent = secondsRemaining;
    
    // Update progress bar if it exists
    const progressBar = document.querySelector('.countdown-indicator div');
    if (progressBar) {
        progressBar.style.width = '100%';
    }
}

// End the game
function endGame() {
    isGameActive = false;
    clearInterval(timerInterval);
    
    // Show results
    showResults();
    
    // Show share popup after a delay
    setTimeout(function() {
        if (typeof showSharePopup === 'function') {
            showSharePopup();
        }
    }, 2000);
}
// Helper function to hash a string for seeding the random number generator
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

// Create a seeded random number generator
function seededRandom(seed) {
    const m = 2**35 - 31;
    const a = 185852;
    let s = seed % m;
    
    return function() {
        return (s = s * a % m) / m;
    };
}

// Create a dataset with coordinates for each day of the year
// Format: "MM-DD": { lat: latitude, lng: longitude, name: "Location Name" }
const dailyLocations = {
    "03-07": { lat: 48.8752, lng: 2.3469, name: "Residential neighborhood in Paris, France" },
    "03-08": { lat: 48.8752, lng: 2.3469, name: "Residential neighborhood in Paris, France" },
    "03-09": { lat: -33.9145, lng: 18.4081, name: "Street in Cape Town, South Africa" },
    "03-10": { lat: 47.6205, lng: -122.3493, name: "Seattle neighborhood, USA" },
    "03-11": { lat: 35.0116, lng: 135.7681, name: "Street in Kyoto, Japan" },
    "03-12": { lat: 22.3193, lng: 114.1694, name: "Hong Kong street scene" },
    "03-13": { lat: 45.5017, lng: -73.5673, name: "Montreal suburb, Canada" },
    "03-14": { lat: -34.6037, lng: -58.3816, name: "Buenos Aires neighborhood, Argentina" },
    
    // Week 3: March 15-21 (Random urban and semi-rural locations)
    "03-15": { lat: 37.9838, lng: 23.7275, name: "Athens side street, Greece" },
    "03-16": { lat: 40.4168, lng: -3.7038, name: "Madrid residential area, Spain" },
    "03-17": { lat: 51.4545, lng: -2.5879, name: "Bristol street, UK" },
    "03-18": { lat: 34.0195, lng: -118.4912, name: "Los Angeles suburb, USA" },
    "03-19": { lat: 59.3293, lng: 18.0686, name: "Stockholm district, Sweden" },
    "03-20": { lat: -36.8485, lng: 174.7633, name: "Auckland neighborhood, New Zealand" },
    "03-21": { lat: 25.2048, lng: 55.2708, name: "Dubai residential area, UAE" },
    
    // Week 4: March 22-28 (Even more random global locations)
    "03-22": { lat: 41.0082, lng: 28.9784, name: "Istanbul neighborhood, Turkey" },
    "03-23": { lat: 19.4326, lng: -99.1332, name: "Mexico City street, Mexico" },
    "03-24": { lat: 50.0755, lng: 14.4378, name: "Prague neighborhood, Czech Republic" },
    "03-25": { lat: 53.3498, lng: -6.2603, name: "Dublin suburb, Ireland" },
    "03-26": { lat: 28.6139, lng: 77.2090, name: "Delhi street, India" },
    "03-27": { lat: 37.5665, lng: 126.9780, name: "Seoul neighborhood, South Korea" },
    "03-28": { lat: 31.2304, lng: 121.4737, name: "Shanghai street, China" },
    
    // Last days of March (Truly random locations with Street View coverage)
    "03-29": { lat: 35.6762, lng: 139.6503, name: "Tokyo residential area, Japan" },
    "03-30": { lat: 43.7102, lng: 7.2620, name: "Street in Nice, France" },
    "03-31": { lat: 41.8781, lng: -87.6298, name: "Chicago neighborhood, USA" }
};

// Function to get today's location from the dataset
function getTodaysLocation() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    const dateKey = `${month}-${day}`;
    
    console.log(`Getting location for date: ${dateKey}`);
    
    // Check if we have a location for today
    if (dailyLocations[dateKey]) {
        return dailyLocations[dateKey];
    } else {
        // Fallback to a default location if today's date isn't in the dataset
        console.log("No location found for today, using default");
        return { lat: 40.7580, lng: -73.9855, name: "Times Square, New York (Default)" };
    }
}

// Function to initialize the daily challenge with today's coordinates
function initializeDailyChallenge() {
    // Reset game state
    guessCount = 0;
    bestGuessDistance = Infinity;
    guesses = [];
    
    // Update UI
    const guessCountElem = document.getElementById('guess-count');
    if (guessCountElem) guessCountElem.textContent = `${guessCount}/3`;
    
    const bestScoreElem = document.getElementById('best-score');
    if (bestScoreElem) bestScoreElem.textContent = '0 mi';
    
    const makeGuessBtn = document.getElementById('make-guess');
    if (makeGuessBtn) makeGuessBtn.disabled = true;
    
    const nextLocationBtn = document.getElementById('next-location');
    if (nextLocationBtn) nextLocationBtn.style.display = 'none';
    
    // Get today's location from our dataset
    const todaysLocation = getTodaysLocation();
    console.log(`Today's location: ${todaysLocation.name}`);
    
    // Create a LatLng object for Google Maps
    actualPosition = new google.maps.LatLng(todaysLocation.lat, todaysLocation.lng);
    
    // Load the Street View panorama at this location
    loadStreetViewPanorama(todaysLocation);
    // Start the timer when panorama is loaded
    const checkPanoramaLoaded = setInterval(function() {
        if (panorama && document.querySelector('.loading-overlay').style.display === 'none') {
            clearInterval(checkPanoramaLoaded);
            startTimer();
        }
    }, 500);
}



// Function to load Street View for the given location
function loadStreetViewPanorama(location) {
    console.log(`Loading Street View for ${location.name} at ${location.lat}, ${location.lng}`);
    
    // Show loading indicator if exists
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
    
    const streetViewService = new google.maps.StreetViewService();
    
    streetViewService.getPanorama({
        location: location,
        radius: 50, // Try to get very close to our exact coordinates
        source: google.maps.StreetViewSource.OUTDOOR
    }, function(data, status) {
        // Hide loading indicator
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        
        if (status === google.maps.StreetViewStatus.OK) {
            console.log("Street View found at exact coordinates");
            
            // Set the panorama position
            panorama.setPosition(data.location.latLng);
            
            // Set a random heading
            const randomHeading = Math.floor(Math.random() * 360);
            panorama.setPov({
                heading: randomHeading,
                pitch: 0
            });
            
            // Store the actual position
            actualPosition = data.location.latLng;
        } else {
            console.log("No Street View at exact coordinates, searching nearby...");
            
            // Try again with a larger radius
            streetViewService.getPanorama({
                location: location,
                radius: 500, // Expanded radius
                source: google.maps.StreetViewSource.OUTDOOR
            }, function(data, status) {
                if (status === google.maps.StreetViewStatus.OK) {
                    console.log("Street View found nearby");
                    
                    // Set the panorama position
                    panorama.setPosition(data.location.latLng);
                    
                    // Set a random heading
                    const randomHeading = Math.floor(Math.random() * 360);
                    panorama.setPov({
                        heading: randomHeading,
                        pitch: 0
                    });
                    
                    // Store the actual position
                    actualPosition = data.location.latLng;
                } else {
                    console.log("No Street View found nearby, using fallback");
                    
                    // Fallback if no Street View found
                    const fallbackLocations = [
                        {lat: 40.7580, lng: -73.9855}, // Times Square, NY
                        {lat: 48.8584, lng: 2.2945},   // Eiffel Tower, Paris
                        {lat: 51.5007, lng: -0.1246},  // Big Ben, London
                        {lat: 37.8199, lng: -122.4783} // Golden Gate Bridge, SF
                    ];
                    const fallback = fallbackLocations[Math.floor(Math.random() * fallbackLocations.length)];
                    
                    panorama.setPosition(fallback);
                    actualPosition = new google.maps.LatLng(fallback.lat, fallback.lng);
                }
            });
        }
    });
}

// Create placeholder panorama (will be updated with actual location)
panorama = new google.maps.StreetViewPanoama(
    streetViewContainer,
    {
        position: { lat: 0, lng: 0 },
        pov: { heading: 0, pitch: 0 },
        zoom: 1,
        addressControl: false,
        showRoadLabels: false,
        linksControl: false,        // Prevent moving from the spot
        clickToGo: false,           // Prevent clicking to move
        disableDoubleClickZoom: false, // Allow double click to zoom
        scrollwheel: true,          // Allow scroll to zoom
        panControl: true,           // Allow looking around
        zoomControl: true,          // Show zoom controls
        enableCloseButton: false,
        fullscreenControl: false,
        motionTracking: false,      // Disable motion tracking
        motionTrackingControl: false // Hide motion tracking control
    }
);

function disableStreetViewMovement(panoramaInstance) {
    if (!panoramaInstance) return;
    
    panoramaInstance.setOptions({
        linksControl: false,       // Hide navigation arrows
        clickToGo: false,          // Prevent clicking to move
        motionTracking: false,     // Disable motion tracking
        motionTrackingControl: false, // Hide motion tracking control
        addressControl: false,     // Hide address
        showRoadLabels: false      // Hide road labels
    });
}
// Share popup functionality
document.addEventListener('DOMContentLoaded', function() {
    // Global variable to store share text
    let shareText = '';
    
    // Function to show share popup
    window.showSharePopup = function() {
        // Generate share text based on game type
        if (gameType === 'daily') {
            const today = new Date();
            const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            shareText = `I was ${Math.round(bestGuessDistance)} mi away on today's GeoWorlder daily challenge! (${dateStr})`;
        } else {
            shareText = `I finished the GeoWorlder 10 locations challenge with a total of ${Math.round(totalDistance)} mi!`;
        }
        
    
        // Update popup text
        const sharePopupText = document.getElementById('sharePopupText');
        if (sharePopupText) {
            sharePopupText.textContent = shareText;
        }
        
        // Show the popup
        const popupOverlay = document.getElementById('sharePopupOverlay');
        const popup = document.getElementById('sharePopup');
        
        if (popupOverlay && popup) {
            popupOverlay.style.display = 'block';
            popup.style.display = 'block';
        }
    };
    
    // Close button event
    const closeBtn = document.getElementById('closeSharePopup');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            window.location.reload();
            document.getElementById('sharePopupOverlay').style.display = 'none';
            document.getElementById('sharePopup').style.display = 'none';
        });
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        const copyBtn = document.getElementById('copyShareBtn');
        if (!copyBtn) return; // Exit if button doesn't exist
        
        copyBtn.addEventListener('click', function() {
            // Get the text from the display element to ensure it exists
            const shareText = document.getElementById('sharePopupText')?.textContent || 
                             'I finished the GeoWorlder challenge!';
            
            // Try the Clipboard API first
            if (navigator.clipboard) {
                navigator.clipboard.writeText(shareText)
                    .then(() => {
                        // Show success feedback
                        const originalText = copyBtn.innerHTML;
                        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        setTimeout(() => {
                            copyBtn.innerHTML = originalText;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Clipboard API failed:', err);
                        // Fall back to execCommand method
                        fallbackCopyMethod(shareText);
                    });
            } else {
                // Use fallback for browsers without Clipboard API
                fallbackCopyMethod(shareText);
            }
        });
        
        // Fallback copy method
        function fallbackCopyMethod(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            
            // Make the textarea part of the page but out of view
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '0';
            document.body.appendChild(textArea);
            
            try {
                textArea.focus();
                textArea.select();
                
                const successful = document.execCommand('copy');
                if (successful) {
                    // Show success feedback
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                } else {
                    alert('Unable to copy text. Please try selecting and copying manually.');
                }
            } catch (err) {
                console.error('execCommand error:', err);
                alert('Unable to copy text. Please try selecting and copying manually.');
            } finally {
                // Always clean up, even if an error occurs
                document.body.removeChild(textArea);
            }
        }
    });
    
    // Twitter share button
    const twitterBtn = document.getElementById('twitterShareBtn');
    if (twitterBtn) {
        twitterBtn.addEventListener('click', function() {
            if (!shareText) return;
            
            const twitterText = encodeURIComponent(shareText + ' Play GeoWorlder today!');
            const twitterURL = `https://twitter.com/intent/tweet?text=${twitterText}`;
            
            window.open(twitterURL, '_blank');
        });
    }
    
    // Facebook share button
    const facebookBtn = document.getElementById('facebookShareBtn');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            if (!shareText) return;
            
            // Facebook sharing requires a URL, so we're just sharing the website
            const fbURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareText)}`;
            
            window.open(fbURL, '_blank');
        });
    }
});

// Modify the endGame function to show the share popup

// Also modify the submitGuess function to show share popup at the end of daily challenge

// Leaderboard functions - Add these to your scripts.js file

// Function to save a score to localStorage
function saveScore(username, score, gameType = 'challenge') {
    // Get existing scores from localStorage
    const storageKey = gameType === 'daily' ? 'dailyScores' : 'challengeScores';
    let scores = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    // Create a new score object
    const newScore = {
        name: username,
        score: Math.round(score),
        avatar: username.substring(0, 2).toUpperCase(),
        timestamp: new Date().toISOString(),
        region: 'all' // Default region, could be customized later
    };
    
    // Add to scores array
    scores.push(newScore);
    
    // Sort by score (ascending, since lower distance is better)
    scores.sort((a, b) => a.score - b.score);
    
    // Keep only top 100 scores to prevent localStorage from getting too large
    scores = scores.slice(0, 100);
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(scores));
    
    console.log(`Score saved: ${username} - ${score}mi`);
}

// Get leaderboard data for a specific time period and region
function getLeaderboardData(period = 'all-time', region = 'all', gameType = 'challenge') {
    // Get all scores from localStorage
    const storageKey = gameType === 'daily' ? 'dailyScores' : 'challengeScores';
    const allScores = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    // Filter scores by time period
    const now = new Date();
    let filteredScores = [];
    
    switch (period) {
        case 'daily':
            // Get today's scores
            filteredScores = allScores.filter(score => {
                const scoreDate = new Date(score.timestamp);
                return scoreDate.toDateString() === now.toDateString();
            });
            break;
        case 'weekly':
            // Get this week's scores
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredScores = allScores.filter(score => {
                const scoreDate = new Date(score.timestamp);
                return scoreDate >= oneWeekAgo;
            });
            break;
        case 'monthly':
            // Get this month's scores
            const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filteredScores = allScores.filter(score => {
                const scoreDate = new Date(score.timestamp);
                return scoreDate >= oneMonthAgo;
            });
            break;
        case 'all-time':
        default:
            // Get all scores
            filteredScores = allScores;
            break;
    }
    
    // Filter by region if applicable
    if (region !== 'all') {
        filteredScores = filteredScores.filter(score => score.region === region);
    }
    
    // Sort scores (ascending, lower distance is better)
    filteredScores.sort((a, b) => a.score - b.score);
    
    // Take top 10
    filteredScores = filteredScores.slice(0, 10);
    
    // Format them for display
    return filteredScores.map((score, index) => {
        return {
            rank: index + 1,
            name: score.name,
            avatar: score.avatar,
            score: score.score,
            timeAgo: formatTimeAgo(new Date(score.timestamp))
        };
    });
}

// Helper function to format time ago
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) {
        return `${diffSec} seconds ago`;
    } else if (diffMin < 60) {
        return `${diffMin} minutes ago`;
    } else if (diffHour < 24) {
        return `${diffHour} hours ago`;
    } else if (diffDay < 30) {
        return `${diffDay} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Modify the showResults function to prompt for username
// Add this to the end of your showResults function in scripts.js
function promptForUsername() {
    // Only prompt if no username is saved
    if (!localStorage.getItem('username')) {
        // Create a popup for username
        const usernamePopup = document.createElement('div');
        usernamePopup.style.position = 'fixed';
        usernamePopup.style.top = '0';
        usernamePopup.style.left = '0';
        usernamePopup.style.width = '100%';
        usernamePopup.style.height = '100%';
        usernamePopup.style.backgroundColor = 'rgba(18, 20, 32, 0.9)';
        usernamePopup.style.zIndex = '1001';
        usernamePopup.style.display = 'flex';
        usernamePopup.style.justifyContent = 'center';
        usernamePopup.style.alignItems = 'center';
        
        // Create popup content
        usernamePopup.innerHTML = `
            <div style="background-color: var(--background); padding: 2rem; border-radius: var(--radius-lg); 
                        max-width: 90%; width: 400px; text-align: center; border: 2px solid var(--primary-color);">
                <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Enter Your Name</h3>
                <p style="margin-bottom: 1.5rem;">Your score will be saved to the leaderboard</p>
                <input type="text" id="username-input" placeholder="Your name" maxlength="15"
                       style="width: 100%; padding: 0.75rem; margin-bottom: 1.5rem; background-color: var(--background-alt);
                              border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-color);">
                <button id="save-username-btn" 
                        style="background-color: var(--primary-color); color: var(--background); border: none;
                               padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; cursor: pointer;">
                    Save & Continue
                </button>
            </div>
        `;
        
        document.body.appendChild(usernamePopup);
        
        // Focus the input
        setTimeout(() => {
            document.getElementById('username-input').focus();
        }, 100);
        
        // Add event listener to save button
        document.getElementById('save-username-btn').addEventListener('click', function() {
            const username = document.getElementById('username-input').value.trim();
            if (username) {
                localStorage.setItem('username', username);
                
                // Save score
                if (gameType === 'daily') {
                    saveScore(username, bestGuessDistance, 'daily');
                } else {
                    saveScore(username, totalDistance, 'challenge');
                }
                
                // Remove the popup
                document.body.removeChild(usernamePopup);
            } else {
                alert('Please enter a valid name');
            }
        });
        
        // Allow Enter key to submit
        document.getElementById('username-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('save-username-btn').click();
            }
        });
    } else {
        // Username already exists, just save the score
        const username = localStorage.getItem('username');
        
        if (gameType === 'daily') {
            saveScore(username, bestGuessDistance, 'daily');
        } else {
            saveScore(username, totalDistance, 'challenge');
        }
    }
}

// Modify the showResults function to call promptForUsername
// Add this line at the end of your showResults function:
// promptForUsername();

// Function to load and render leaderboard data
function loadLeaderboardData(period = 'all-time', region = 'all') {
    // Get leaderboard table body
    const leaderboardTable = document.querySelector('.leaderboard-table tbody');
    if (!leaderboardTable) return;
    
    // Show loading state
    leaderboardTable.style.opacity = '0.5';
    
    // Get data for the selected period
    const data = getLeaderboardData(period, region);
    
    // Clear existing rows
    leaderboardTable.innerHTML = '';
    
    // Check if no data
    if (data.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="4" style="text-align: center; padding: 2rem;">
                <div>
                    <i class="fas fa-trophy" style="font-size: 2.5rem; color: var(--text-light); margin-bottom: 1rem; display: block;"></i>
                    <p style="color: var(--text-light);">No scores yet! Be the first to complete the challenge.</p>
                </div>
            </td>
        `;
        leaderboardTable.appendChild(emptyRow);
    } else {
        // Render leaderboard rows
        data.forEach(player => {
            const topClass = player.rank <= 3 ? `top-${player.rank}` : '';
            
            const row = document.createElement('tr');
            row.className = player.rank <= 3 ? `top-rank ${topClass}` : '';
            
            row.innerHTML = `
                <td class="rank-cell">${player.rank}</td>
                <td>
                    <div class="player-cell">
                        <div class="player-avatar">${player.avatar}</div>
                        <div class="player-info">
                            <div class="player-name">${player.name}</div>
                        </div>
                    </div>
                </td>
                <td class="score-cell">${player.score.toLocaleString()} mi</td>
                <td><span class="time-ago">${player.timeAgo}</span></td>
            `;
            
            leaderboardTable.appendChild(row);
        });
    }
    
    // Restore opacity
    leaderboardTable.style.opacity = '1';
}

// Initialize the leaderboard
function initLeaderboard() {
    // Skip if not on leaderboard page
    if (!document.querySelector('.leaderboard-section')) return;
    
    // Initialize time period tabs
    const timePeriodTabs = document.querySelectorAll('.time-period-tab');
    if (timePeriodTabs.length > 0) {
        timePeriodTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                timePeriodTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Get selected period
                const period = this.getAttribute('data-period');
                
                // Update leaderboard title based on selected period
                const periodText = this.textContent;
                const leaderboardTitle = document.querySelector('.leaderboard-title');
                if (leaderboardTitle) {
                    leaderboardTitle.textContent = `10 Location Challenge - Top Scores (${periodText})`;
                }
                
                // Get selected region
                const regionFilter = document.getElementById('challenge-filter');
                const region = regionFilter ? regionFilter.value : 'all';
                
                // Load and render leaderboard data
                loadLeaderboardData(period, region);
            });
        });
    }
    
    // Initialize region filter
    const regionFilter = document.getElementById('challenge-filter');
    if (regionFilter) {
        regionFilter.addEventListener('change', function() {
            // Get selected period
            const activePeriodTab = document.querySelector('.time-period-tab.active');
            const period = activePeriodTab ? activePeriodTab.getAttribute('data-period') : 'all-time';
            
            // Load and render leaderboard data
            loadLeaderboardData(period, this.value);
        });
    }
    
    // Initial data load
    loadLeaderboardData('all-time', 'all');
}

// Add initLeaderboard() to your document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Your existing code...
    
    // Initialize leaderboard if on leaderboard page
    initLeaderboard();
});

// Modify the showResults function to save score to leaderboard
// Add this at the end of your showResults function:
function modifyShowResults() {
    // Add this to the end of your existing showResults function:
    setTimeout(() => {
        promptForUsername();
    }, 500);
}
// Add this function to your scripts.js file to automatically call it when on the leaderboard page

// Function to check if we're on the leaderboard page
function isLeaderboardPage() {
    return window.location.pathname.includes('leaderboard.html') || 
           document.querySelector('.leaderboard-section') !== null;
}

// Auto-initialize leaderboard when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // If on the leaderboard page, initialize it
    if (isLeaderboardPage()) {
        console.log("Leaderboard page detected, initializing...");
        initLeaderboard();
    }
    
    // Add event listener to leaderboard link
    const leaderboardLinks = document.querySelectorAll('a[href="leaderboard.html"]');
    leaderboardLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // If we already have a loadLeaderboardData function defined,
            // we can optionally preload the data
            if (typeof loadLeaderboardData === 'function') {
                // Pre-fetch leaderboard data
                loadLeaderboardData('all-time', 'all');
            }
        });
    });
});


// Debugging function to populate leaderboard with sample data (for testing)
function populateSampleLeaderboardData() {
    const samplePlayers = [
        { name: "GeoMaster", score: 1247 },
        { name: "WorldTraveler", score: 1895 },
        { name: "MapWiz", score: 2103 },
        { name: "GlobeTrotter", score: 2542 },
        { name: "LandSeeker", score: 2897 },
        { name: "CoordHunter", score: 3145 },
        { name: "StreetViewer", score: 3489 },
        { name: "LocationAce", score: 3772 },
        { name: "GeoGuru", score: 4023 },
        { name: "EarthExplorer", score: 4198 }
    ];
    
    // Clear existing data
    localStorage.removeItem('challengeScores');
    
    // Create sample data with timestamps spread over the last month
    const now = new Date();
    const scores = samplePlayers.map((player, index) => {
        // Create timestamps spread over last month
        const daysAgo = Math.floor(Math.random() * 30);
        const hoursAgo = Math.floor(Math.random() * 24);
        const timestamp = new Date(now);
        timestamp.setDate(timestamp.getDate() - daysAgo);
        timestamp.setHours(timestamp.getHours() - hoursAgo);
        
        return {
            name: player.name,
            score: player.score,
            avatar: player.name.substring(0, 2).toUpperCase(),
            timestamp: timestamp.toISOString(),
            region: 'all'
        };
    });
    
    // Save to localStorage
    localStorage.setItem('challengeScores', JSON.stringify(scores));
    
    console.log('Sample leaderboard data populated!');
    
    // Reload the leaderboard if on the page
    if (isLeaderboardPage()) {
        loadLeaderboardData('all-time', 'all');
    }
}
// Add this to your scripts.js file to integrate the Game Finished popup

// Function to trigger the game finished popup
function triggerGameFinished(gameType, distance) {
    // Check if showGameFinishedPopup function exists
    if (typeof window.showGameFinishedPopup === 'function') {
      window.showGameFinishedPopup(gameType, distance);
    } else {
      // Dispatch custom event as fallback
      const gameCompleteEvent = new CustomEvent('gameComplete', {
        detail: {
          gameType: gameType,
          distance: distance
        }
      });
      window.dispatchEvent(gameCompleteEvent);
    }
  }
  
  // Daily Challenge - modify the showResults function
  const originalShowResults = window.showResults;
  if (typeof originalShowResults === 'function') {
    window.showResults = function() {
      // Call the original function first
      if (originalShowResults) originalShowResults.apply(this, arguments);
      
      // Now trigger our custom popup
      setTimeout(function() {
        triggerGameFinished('daily', window.bestGuessDistance || 0);
      }, 1000);
    };
  }
  
  // Challenge Mode - modify the endGame function
  const originalEndGame = window.endGame;
  if (typeof originalEndGame === 'function') {
    window.endGame = function() {
      // Call the original function first
      if (originalEndGame) originalEndGame.apply(this, arguments);
      
      // Now trigger our custom popup
      setTimeout(function() {
        triggerGameFinished('challenge', window.totalDistance || 0);
      }, 1000);
    };
  }
  
  // Also need to hook into submitGuess for daily challenge
  
  
  // Clear any existing popup-related intervals to avoid duplicates
  const existingIntervals = window.popupIntervals || [];
  existingIntervals.forEach(function(intervalId) {
    clearInterval(intervalId);
  });
  window.popupIntervals = [];
  
  // Add a failsafe to check for game completion
  const gameCompletionInterval = setInterval(function() {
    // For daily challenge
    if (window.gameType === 'daily' && window.guessCount >= 3) {
      triggerGameFinished('daily', window.bestGuessDistance || 0);
      clearInterval(gameCompletionInterval);
    }
    
    // For 10 location challenge
    if (window.gameType === 'challenge' && window.currentLocationIndex >= 9 && window.guesses.length >= 10) {
      triggerGameFinished('challenge', window.totalDistance || 0);
      clearInterval(gameCompletionInterval);
    }
  }, 2000);
  
  window.popupIntervals.push(gameCompletionInterval);
  
  // Make sure our popup takes precedence by removing old popups
  document.addEventListener('DOMContentLoaded', function() {
    // Hide the old share popup if it exists
    const oldPopups = [
      'simpleSharePopup',
      'sharePopup',
      'sharePopupOverlay',
      'results-modal'
    ];
    
    oldPopups.forEach(function(popupId) {
      const popup = document.getElementById(popupId);
      if (popup) {
        // Either remove or hide it
        if (popupId === 'results-modal') {
          // Just hide the results modal in case it's needed elsewhere
          popup.style.display = 'none';
        } else {
          // For the others, we can remove them entirely
          popup.parentNode.removeChild(popup);
        }
      }
    });
  });
  document.addEventListener('DOMContentLoaded', function() {
    // Check if this is the post-click refresh
    const hasRefreshed = sessionStorage.getItem('pageRefreshed');
    
    if (hasRefreshed) {
        // If we've already refreshed once, clear the flag
        sessionStorage.removeItem('pageRefreshed');
        console.log('Page has been refreshed');
    } else {
        // Set up click handler for the entire document
        document.addEventListener('click', function clickHandler() {
            // Set the flag that we're about to refresh
            sessionStorage.setItem('pageRefreshed', 'true');
            
            // Remove the click handler to prevent multiple refreshes
            document.removeEventListener('click', clickHandler);
            
            console.log('Refreshing page after click...');
            
            // Refresh the page
            setTimeout(function() {
                window.location.reload();
            }, 100); // Small delay to ensure the sessionStorage is set
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const hasRefreshed = sessionStorage.getItem('pageRefreshed');
    const myButton = document.getElementById('myButton'); // Replace with your button ID
    
    if (hasRefreshed) {
        sessionStorage.removeItem('pageRefreshed');
        console.log('Page has been refreshed after button click');
    } else if (myButton) {
        myButton.addEventListener('click', function() {
            sessionStorage.setItem('pageRefreshed', 'true');
            console.log('Refreshing page after button click...');
            setTimeout(function() {
                window.location.reload();
            }, 100);
        });
    }
});
function restartGame() {
    // Clear any game state if needed
    isGameActive = false;
    clearInterval(timerInterval);
    
    // Close any open modals
    const modals = document.querySelectorAll('.modal, .custom-popup, .custom-popup-overlay');
    modals.forEach(modal => {
        if (modal) modal.style.display = 'none';
    });
    
    // Reload the page to restart completely
    window.location.reload();
}
// In the play again button event handler
if (playAgainBtn) {
    playAgainBtn.addEventListener('click', function() {
        restartGame();
    });
}

// In the share popup close button
if (closeBtn) {
    closeBtn.addEventListener('click', function() {
        restartGame();
    });
}
// Add this to scripts.js

// Function to ensure both daily and challenge popups have consistent copy functionality
function setupPopupCopyButton(buttonId, shareTextGenerator) {
    const copyBtn = document.getElementById(buttonId);
    if (!copyBtn) return;
    
    copyBtn.addEventListener('click', function() {
        // Generate the share text using the provided function
        const textToCopy = typeof shareTextGenerator === 'function' ? 
            shareTextGenerator() : shareText;
        
        // Try to use the clipboard API
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // Show visual feedback that text was copied
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    
                    setTimeout(function() {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                })
                .catch(function(err) {
                    console.error('Copy failed:', err);
                    alert('Could not copy to clipboard. Try again.');
                });
        } else {
            // Fallback for browsers that don't support clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '0';
            document.body.appendChild(textArea);
            
            try {
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                if (successful) {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    
                    setTimeout(function() {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                } else {
                    alert('Could not copy to clipboard. Try again.');
                }
            } catch (err) {
                console.error('execCommand error:', err);
                alert('Could not copy to clipboard. Try again.');
            } finally {
                document.body.removeChild(textArea);
            }
        }
    });
}

// Modify the showSharePopup function to ensure it works for both daily and challenge modes
function showSharePopup() {
    // Check if our custom popup exists, otherwise create it
    let popupOverlay = document.getElementById('sharePopupOverlay');
    let sharePopup = document.getElementById('sharePopup');
    
    // Get current date in a readable format
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Initialize share text and popup content based on game type
    let popupContent = '';
    let popupTitle = '';
    
    if (gameType === 'daily') {
        // For Daily Challenge
        popupTitle = 'Daily Challenge Complete!';
        
        // Find best guess
        let bestGuessInfo = {
            distance: bestGuessDistance,
            guessNumber: guessCount,
        };
        
        // Process guesses to find guess number with best distance
        if (guesses && guesses.length > 0) {
            guesses.forEach((guess, index) => {
                if (guess.distance === bestGuessDistance) {
                    bestGuessInfo.guessNumber = index + 1;
                }
            });
        }
        
        // Create popup content for daily challenge
        popupContent = `
            <p><strong>Best Guess:</strong> <span class="best-value">${Math.round(bestGuessDistance)} mi</span></p>
            <p><strong>Total Guesses:</strong> ${guessCount}/3</p>
            <p><strong>Date:</strong> ${dateStr}</p>
        `;
        
        // Set share text for daily challenge
        shareText = `🌎 My GeoWorlder daily challenge result for ${dateStr} was ${Math.round(bestGuessDistance)} mi away! 🌎
Try it yourself at GeoWorlder.com`;
        
    } else {
        // For 10 Location Challenge
        popupTitle = '10 Location Challenge Complete!';
        
        // Find best and worst guesses
        let bestGuess = { distance: Infinity, location: "Unknown" };
        let worstGuess = { distance: 0, location: "Unknown" };
        
        // Only process guesses if array exists and has items
        if (guesses && guesses.length > 0) {
            // Find best and worst guesses
            guesses.forEach((guess, index) => {
                // Update best guess (lowest distance)
                if (guess.distance < bestGuess.distance) {
                    bestGuess = {
                        distance: guess.distance,
                        location: guess.location || `Location ${index + 1}`,
                        index: index + 1
                    };
                }
                
                // Update worst guess (highest distance)
                if (guess.distance > worstGuess.distance) {
                    worstGuess = {
                        distance: guess.distance,
                        location: guess.location || `Location ${index + 1}`,
                        index: index + 1
                    };
                }
            });
        }
        
        // If no guesses were found, set default values
        if (bestGuess.distance === Infinity) {
            bestGuess = { distance: 0, location: "N/A", index: 0 };
        }
        
        if (worstGuess.distance === 0 && guesses && guesses.length > 0) {
            worstGuess = bestGuess; // Set to best if we couldn't find a worst (shouldn't happen)
        }
        
        // Create popup content for 10 location challenge
        popupContent = `
            <p><strong>Total Distance:</strong> ${Math.round(totalDistance)} mi</p>
            <p><strong>Best Guess:</strong> <span class="best-value">${Math.round(bestGuess.distance)} mi</span> (${bestGuess.location})</p>
            <p><strong>Worst Guess:</strong> <span class="worst-value">${Math.round(worstGuess.distance)} mi</span> (${worstGuess.location})</p>
        `;
        
        // Set share text for 10 location challenge
        shareText = `🌎 I completed GeoWorlder's 10 Locations Challenge with a total of ${Math.round(totalDistance)} mi! 🌎
Best Guess: ${Math.round(bestGuess.distance)} mi
Worst Guess: ${Math.round(worstGuess.distance)} mi
Try it yourself at GeoWorlder.com`;
    }
    
    if (!popupOverlay) {
        // Create overlay
        popupOverlay = document.createElement('div');
        popupOverlay.id = 'sharePopupOverlay';
        popupOverlay.className = 'custom-popup-overlay';
        document.body.appendChild(popupOverlay);
    }
    
    if (!sharePopup) {
        // Create popup
        sharePopup = document.createElement('div');
        sharePopup.id = 'sharePopup';
        sharePopup.className = 'custom-popup';
        
        // Create popup HTML structure
        sharePopup.innerHTML = `
            <div class="custom-popup-icon">
                <i class="fas fa-trophy"></i>
            </div>
            <div class="custom-popup-title">${popupTitle}</div>
            <div class="custom-popup-message">
                ${popupContent}
            </div>
            <div class="share-buttons">
                <button class="btn btn-share twitter"><i class="fab fa-twitter"></i></button>
                <button class="btn btn-share facebook"><i class="fab fa-facebook-f"></i></button>
                <button class="btn btn-copy" id="popupCopyBtn"><i class="fas fa-copy"></i> Copy</button>
            </div>
            <button class="custom-popup-button" id="closeSharePopup">Play Again</button>
        `;
        
        document.body.appendChild(sharePopup);
        
        // Add event listeners
        const closeBtn = document.getElementById('closeSharePopup');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                popupOverlay.style.display = 'none';
                sharePopup.style.display = 'none';
                window.location.reload();
            });
        }
        
        // Set up the copy button
        setupPopupCopyButton('popupCopyBtn', () => shareText);
        
        const twitterBtn = sharePopup.querySelector('.btn-share.twitter');
        if (twitterBtn) {
            twitterBtn.addEventListener('click', function() {
                shareOnTwitter();
            });
        }
        
        const facebookBtn = sharePopup.querySelector('.btn-share.facebook');
        if (facebookBtn) {
            facebookBtn.addEventListener('click', function() {
                shareOnFacebook();
            });
        }
    } else {
        // Update existing popup
        const popupTitleElement = sharePopup.querySelector('.custom-popup-title');
        if (popupTitleElement) {
            popupTitleElement.textContent = popupTitle;
        }
        
        const popupMessageElement = sharePopup.querySelector('.custom-popup-message');
        if (popupMessageElement) {
            popupMessageElement.innerHTML = popupContent;
        }
    }
    
    // Show the popup
    popupOverlay.style.display = 'block';
    sharePopup.style.display = 'block';
}

// Add this to document ready to initialize copy buttons on both types of popups
document.addEventListener('DOMContentLoaded', function() {
    // Add setup for simple share popup copy button
    setupPopupCopyButton('simpleCopyBtn', function() {
        // Get current date in format "Mar 7, 2025"
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        // Generate appropriate text based on game type
        if (gameType === 'daily') {
            return `I was ${Math.round(bestGuessDistance)} mi away on today's GeoWorlder daily challenge! (${dateStr})`;
        } else {
            return `I finished the GeoWorlder 10 locations challenge with a total of ${Math.round(totalDistance)} mi!`;
        }
    });
    
    // Also set up the copy button in the results modal
    setupPopupCopyButton('copyResultsBtn', function() {
        return shareText;
    });
});
// Add this to scripts.js or update the existing functions

// Improved function to handle game restart
function restartGame() {
    // Clear any game state
    isGameActive = false;
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Close any open modals or popups
    const modals = document.querySelectorAll('.modal, .custom-popup, .custom-popup-overlay, #sharePopup, #sharePopupOverlay, #simpleSharePopup');
    modals.forEach(modal => {
        if (modal) modal.style.display = 'none';
    });
    
    // Force reload the page with cache bypass
    const currentPage = window.location.href.split('?')[0];
    window.location.href = currentPage + '?t=' + new Date().getTime();
}

// Improved close/play again handlers for share popup
document.addEventListener('DOMContentLoaded', function() {
    // Handle the custom close share popup button
    const closeShareBtns = document.querySelectorAll('#closeSharePopup, #simpleCloseBtn');
    closeShareBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                restartGame();
            });
        }
    });
    
    // Handle play again button in results modal
    const playAgainBtn = document.getElementById('play-again');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', function(e) {
            e.preventDefault();
            restartGame();
        });
    }
    
    // Fix for mobile Safari and some browsers that might not properly reload
    window.onpageshow = function(event) {
        if (event.persisted) {
            // Page was loaded from cache (back/forward navigation)
            window.location.reload();
        }
    };
});

// Update the submitGuess function for challenge mode to ensure proper "Next Location" button functionality
const originalSubmitGuess = submitGuess; // Store original function if it exists
submitGuess = function() {
    // Get the guess position
    const guessPosition = guessMarker.getPosition();
    
    // Calculate distance to actual position
    const distance = calculateDistance(guessPosition, actualPosition);
    
    // Store the guess
    const guessInfo = {
        position: guessPosition,
        distance: distance,
        location: getLocationName(guessPosition)
    };
    guesses.push(guessInfo);
    
    if (gameType === 'daily') {
        // Daily challenge logic - call original function if available
        if (typeof originalSubmitGuess === 'function') {
            originalSubmitGuess.apply(this, arguments);
        }
    } else if (gameType === 'challenge') {
        // Challenge mode logic
        // Add the distance to the total
        totalDistance += distance;
        
        // Update UI
        const totalDistanceElem = document.getElementById('total-distance');
        if (totalDistanceElem) totalDistanceElem.textContent = `${Math.round(totalDistance)} mi`;
        
        // Show actual location and draw line
        new google.maps.Marker({
            position: actualPosition,
            map: map,
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
            }
        });
        
        new google.maps.Polyline({
            path: [guessPosition, actualPosition],
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: map
        });
        
        // Zoom to show both markers
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(guessPosition);
        bounds.extend(actualPosition);
        map.fitBounds(bounds);
        
        // Stop the timer
        clearInterval(timerInterval);
        
        // Check if it's the last location
        if (currentLocationIndex >= 9) {
            // Game over - show results
            setTimeout(function() {
                showResults();
                showSharePopup();
            }, 1500);
        } else {
            // Enable the next location button
            const nextLocationBtn = document.getElementById('next-location');
            if (nextLocationBtn) {
                nextLocationBtn.disabled = false;
                nextLocationBtn.style.display = 'inline-block';
                
                // Ensure the next location button has a click handler
                if (!nextLocationBtn.hasClickListener) {
                    nextLocationBtn.hasClickListener = true;
                    nextLocationBtn.addEventListener('click', function() {
                        loadChallengeLocation(currentLocationIndex + 1);
                    });
                }
            }
        }
    }
};

// Improved next location function
function nextLocation() {
    // Show loading overlay
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
    
    // Clear the previous markers
    if (guessMarker) {
        guessMarker.setVisible(false);
    }
    
    // Remove any other markers or lines
    if (window.currentMarkers && window.currentMarkers.length) {
        window.currentMarkers.forEach(marker => marker.setMap(null));
    }
    if (window.currentLines && window.currentLines.length) {
        window.currentLines.forEach(line => line.setMap(null));
    }
    
    window.currentMarkers = [];
    window.currentLines = [];
    
    // Move to the next location
    loadChallengeLocation(currentLocationIndex + 1);
}