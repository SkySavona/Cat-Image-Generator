// script.js
const API_KEY = 'live_WvaKPbPOo4Y9aHM92jWUGKs9bW4oRA8IGvqNltcAKwxUpGBDlAWgYUcAjkaFqiDy';
let breedList = [];

document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.querySelector('button');
    const tagInput = document.getElementById('category');
    
    generateButton.addEventListener('click', generateCats);
    tagInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            generateCats();
        }
    });
    
    // Hide the generated cats section initially
    document.querySelector('.generated-cats').style.display = 'none';

    // Fetch the list of breeds when the page loads
    fetchBreeds();
});

async function fetchBreeds() {
    try {
        const response = await fetch('https://api.thecatapi.com/v1/breeds', {
            headers: {
                'x-api-key': API_KEY
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        breedList = await response.json();
        console.log('Breeds fetched:', breedList);
    } catch (error) {
        console.error('Error fetching breeds:', error);
    }
}

function convertTagsToBreedIds(tags) {
    const userTags = tags.toLowerCase().split(',').map(tag => tag.trim());
    const matchedBreeds = breedList.filter(breed => 
        userTags.some(tag => 
            breed.name.toLowerCase().includes(tag) ||
            (breed.temperament && breed.temperament.toLowerCase().includes(tag)) ||
            (breed.origin && breed.origin.toLowerCase().includes(tag))
        )
    );
    return matchedBreeds.map(breed => breed.id).join(',');
}

async function fetchCatImages(tags, limit = 6) {
    const breedIds = convertTagsToBreedIds(tags);
    const url = `https://api.thecatapi.com/v1/images/search?limit=${limit}&order=RANDOM${breedIds ? `&breed_ids=${breedIds}` : ''}`;
    console.log('Fetching cat images from URL:', url);
    const response = await fetch(url, {
        headers: {
            'x-api-key': API_KEY
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API Response:', data);
    return data;
}

async function generateCats() {
    const tagInput = document.getElementById('category').value.trim();
    const catGrid = document.querySelector('.generated-cat-grid');
    const loadingIndicator = document.createElement('p');
    loadingIndicator.textContent = 'Loading cats...';
    catGrid.parentElement.insertBefore(loadingIndicator, catGrid);

    // Hide the cat grid while loading
    catGrid.style.display = 'none';

    try {
        console.log('Generating cats with tags:', tagInput);
        const catData = await fetchCatImages(tagInput);

        if (catData.length === 0) {
            throw new Error('No cat images found for the given tags.');
        }

        const images = catGrid.querySelectorAll('img');
        catData.forEach((cat, index) => {
            if (images[index]) {
                console.log(`Setting image ${index + 1} src to:`, cat.url);
                images[index].src = cat.url;
                images[index].alt = `Generated cat ${index + 1}`;
                images[index].onerror = function() {
                    console.error(`Error loading image ${index + 1}`);
                    this.src = 'https://via.placeholder.com/400x300?text=Cat+Image+Not+Available';
                    this.alt = 'Cat image not available';
                };
            }
        });

        loadingIndicator.remove();
        // Show the generated cats section and the cat grid
        const generatedCatsSection = document.querySelector('.generated-cats');
        generatedCatsSection.style.display = 'block';
        catGrid.style.display = 'grid';

        console.log('Cat images should now be displayed');

        // Scroll to the generated cats section
        generatedCatsSection.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error in generateCats:', error);
        loadingIndicator.textContent = 'Failed to load cat images. Please try again.';
        // Show error message to the user
        const errorMessage = document.createElement('p');
        errorMessage.textContent = `Unable to fetch cat images: ${error.message}`;
        errorMessage.style.color = 'red';
        catGrid.parentElement.insertBefore(errorMessage, catGrid);
    }
}