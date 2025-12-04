// API key for weather data API 
const API_KEY = '7422aa9cfc65863a7d81f007a0d39c0b'; 

// Mock data for demonstration purposes
const AIR_QUALITY_DATA = [
    {
        id: 1,
        location: "Downtown",
        ObservationTime: "2024-01-15 14:30",
        LocationName: "Portage & Main Station",
        AQI: 45,
        PM25: 12.5,
        PM10: 23.1,
        O3: 28.7,
        NO2: 15.2,
        SO2: 3.1,
        CO: 0.8
    },
    {
        id: 2,
        location: "West End",
        ObservationTime: "2024-01-15 14:45",
        LocationName: "Polo Park Station",
        AQI: 62,
        PM25: 18.3,
        PM10: 32.4,
        O3: 35.2,
        NO2: 22.1,
        SO2: 4.5,
        CO: 1.2
    },
    {
        id: 3,
        location: "North End",
        ObservationTime: "2024-01-15 14:50",
        LocationName: "Kildonan Station",
        AQI: 28,
        PM25: 8.9,
        PM10: 18.7,
        O3: 22.4,
        NO2: 11.8,
        SO2: 2.3,
        CO: 0.6
    },
    {
        id: 4,
        location: "St. Vital",
        ObservationTime: "2024-01-15 15:00",
        LocationName: "St. Vital Station",
        AQI: 85,
        PM25: 25.6,
        PM10: 41.2,
        O3: 42.8,
        NO2: 28.9,
        SO2: 5.7,
        CO: 1.8
    },
    {
        id: 5,
        location: "Transcona",
        ObservationTime: "2024-01-15 15:15",
        LocationName: "Transcona Station",
        AQI: 110,
        PM25: 35.2,
        PM10: 58.7,
        O3: 52.4,
        NO2: 34.6,
        SO2: 8.2,
        CO: 2.4
    },
    {
        id: 6,
        location: "Charleswood",
        ObservationTime: "2024-01-15 15:30",
        LocationName: "Charleswood Station",
        AQI: 38,
        PM25: 11.2,
        PM10: 21.8,
        O3: 26.5,
        NO2: 14.3,
        SO2: 2.8,
        CO: 0.7
    },
    {
        id: 7,
        location: "River Heights",
        ObservationTime: "2024-01-15 16:00",
        LocationName: "River Heights Station",
        AQI: 155,
        PM25: 42.8,
        PM10: 68.9,
        O3: 61.3,
        NO2: 41.2,
        SO2: 9.8,
        CO: 3.1
    },
    {
        id: 8,
        location: "East Kildonan",
        ObservationTime: "2024-01-15 16:15",
        LocationName: "East Kildonan Station",
        AQI: 72,
        PM25: 20.1,
        PM10: 35.6,
        O3: 38.4,
        NO2: 25.3,
        SO2: 5.1,
        CO: 1.4
    }
];

// DOM elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const clearButton = document.getElementById('clearButton');
const loadingElement = document.getElementById('loading');
const resultsContainer = document.getElementById('results');
const errorElement = document.getElementById('error');
const noResultsElement = document.getElementById('noResults');

// Event listeners
searchForm.addEventListener('submit', handleSearch);
searchInput.addEventListener('input', debounce(handleLiveSearch, 300));
clearButton.addEventListener('click', clearSearch);

// Initialize with all data
document.addEventListener('DOMContentLoaded', () => {
    displayResults(AIR_QUALITY_DATA);
});

// Handle search form submission
function handleSearch(event) {
    event.preventDefault();
    performSearch();
}

// Handle live search as user types
function handleLiveSearch() {
    performSearch();
}

// Perform the actual search
function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        displayResults(AIR_QUALITY_DATA);
        return;
    }
    
    loadingElement.classList.remove('hidden');
    resultsContainer.innerHTML = '';
    errorElement.classList.add('hidden');
    noResultsElement.classList.add('hidden');
    
    // Simulate API delay
    setTimeout(() => {
        try {
            const filteredData = AIR_QUALITY_DATA.filter(station => {
                return Object.values(station).some(value => 
                    String(value).toLowerCase().includes(searchTerm)
                );
            });
            
            loadingElement.classList.add('hidden');
            
            if (filteredData.length > 0) {
                displayResults(filteredData);
            } else {
                noResultsElement.classList.remove('hidden');
            }
        } catch (error) {
            showError('An error occurred while searching. Please try again.');
        }
    }, 500);
}

// Clear search and show all data
function clearSearch() {
    searchInput.value = '';
    displayResults(AIR_QUALITY_DATA);
    noResultsElement.classList.add('hidden');
    errorElement.classList.add('hidden');
}

// Display results in the grid
function displayResults(data) {
    resultsContainer.innerHTML = '';
    
    data.forEach(station => {
        const stationCard = createStationCard(station);
        resultsContainer.appendChild(stationCard);
    });
}

// Create a station card element
function createStationCard(station) {
    const card = document.createElement('div');
    card.className = 'station-card';

    card.innerHTML = `
        <div class="station-header">
            <div class="station-name">${escapeHtml(station.LocationName)}</div>
            <div class="aqi-indicator ${getAQIClass(station.AQI)}">
                AQI: ${station.AQI}
            </div>
        </div>
        <div class="station-details">
            <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${escapeHtml(station.location)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Observation Time:</span>
                <span class="detail-value">${escapeHtml(station.ObservationTime)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">PM2.5:</span>
                <span class="detail-value">${station.PM25} μg/m³</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">PM10:</span>
                <span class="detail-value">${station.PM10} μg/m³</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Ozone (O3):</span>
                <span class="detail-value">${station.O3} ppb</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Nitrogen Dioxide (NO2):</span>
                <span class="detail-value">${station.NO2} ppb</span>
            </div>
        </div>
    `;
    
    return card;
}


function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Get AQI class based on value
function getAQIClass(aqi) {
    if (aqi <= 50) return 'aqi-good';
    if (aqi <= 100) return 'aqi-moderate';
    if (aqi <= 150) return 'aqi-unhealthy-sensitive';
    if (aqi <= 200) return 'aqi-unhealthy';
    if (aqi <= 300) return 'aqi-very-unhealthy';
    return 'aqi-hazardous';
}

// Show error message
function showError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    loadingElement.classList.add('hidden');
    noResultsElement.classList.add('hidden');
}

// Debounce function for live search
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Simulate fetching data from API 
async function fetchAirQualityData() {
    try {

        const response = await fetch(`https://api.weatherdata.com/airquality?city=Winnipeg&apiKey=${API_KEY}`);
        if (!response.ok) {
            throw new Error('Failed to fetch air quality data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching air quality data:', error);
        showError('Unable to load air quality data. Showing sample data instead.');
        return AIR_QUALITY_DATA; 
    }
}