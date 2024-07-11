const API_KEY = 'live_WvaKPbPOo4Y9aHM92jWUGKs9bW4oRA8IGvqNltcAKwxUpGBDlAWgYUcAjkaFqiDy';
let breedList = [];

document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeButton = document.querySelector('.close-button');
  
    if (burgerMenu && mobileMenu) {
        burgerMenu.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
    }

    if (closeButton && mobileMenu) {
        closeButton.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (mobileMenu && mobileMenu.classList.contains('active') && !mobileMenu.contains(event.target) && event.target !== burgerMenu) {
            mobileMenu.classList.remove('active');
        }
    });

    const generateButton = document.querySelector('button');
    const breedDropdown = document.getElementById('breed-select');
      
    if (generateButton) {
        generateButton.addEventListener('click', generateCats);
    }
      
    // Hide the generated cats section initially
    const generatedCatsSection = document.querySelector('.generated-cats');
    if (generatedCatsSection) {
        generatedCatsSection.style.display = 'none';
    }

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
        populateBreedDropdown();
    } catch (error) {
        console.error('Error fetching breeds:', error);
    }
}

function populateBreedDropdown() {
    const breedDropdown = document.getElementById('breed-select');
    breedDropdown.innerHTML = '<option value="">All Breeds</option>';
    breedList.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.textContent = breed.name;
        breedDropdown.appendChild(option);
    });
}

async function fetchCatImages(breedId, limit = 6) {
    let url = `https://api.thecatapi.com/v1/images/search?limit=${limit}&order=RANDOM`;
    
    if (breedId) {
        url += `&breed_ids=${breedId}`;
    }
    
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
    const breedSelect = document.getElementById('breed-select');
    const selectedBreedId = breedSelect.value;
    const generatedCatsSection = document.querySelector('.generated-cats');
    const catGrid = document.querySelector('.generated-cat-grid');
    const loadingContainer = document.querySelector('.loading-container');
    const loadingMessage = document.querySelector('.loading-message');
    const generatedCatsHeading = document.querySelector('.generated-cats-heading');

    // Show the generated cats section and loading animation
    generatedCatsSection.style.display = 'block';
    loadingContainer.style.display = 'flex';
    loadingMessage.style.display = 'block';
    generatedCatsHeading.style.display = 'none';
    catGrid.style.display = 'none';

    // Scroll to the generated cats section
    generatedCatsSection.scrollIntoView({ behavior: 'smooth' });

    try {
        console.log('Generating cats with breed:', selectedBreedId);
        const catData = await fetchCatImages(selectedBreedId);

        if (catData.length === 0) {
            throw new Error('No cat images found for the given criteria.');
        }

        const images = catGrid.querySelectorAll('img');
        const loadImage = (url, imgElement) => {
            return new Promise((resolve, reject) => {
                imgElement.onload = () => resolve(imgElement);
                imgElement.onerror = () => {
                    console.error(`Error loading image: ${url}`);
                    imgElement.src = './assets/no_img_cat.png';
                    imgElement.alt = 'Cat image not available';
                    resolve(imgElement);
                };
                imgElement.src = url;
            });
        };

        const imagePromises = catData.map((cat, index) => {
            if (images[index]) {
                console.log(`Setting image ${index + 1} src to:`, cat.url);
                return loadImage(cat.url, images[index]);
            }
            return Promise.resolve();
        });

        // Fill remaining slots with placeholder if not enough images
        for (let i = catData.length; i < images.length; i++) {
            images[i].src = './assets/no_img_cat.png';
            images[i].alt = 'Cat image not available';
        }

        await Promise.all(imagePromises);

        // Add a slight delay before showing the cat images
        setTimeout(() => {
            // Hide loading animation and show cat grid
            loadingContainer.style.display = 'none';
            loadingMessage.style.display = 'none';
            generatedCatsHeading.style.display = 'block';
            catGrid.style.display = 'grid';

            console.log('Cat images should now be displayed');
        }, 4000); 

    } catch (error) {
        console.error('Error in generateCats:', error);
        loadingContainer.style.display = 'none';
        loadingMessage.style.display = 'none';
        // Show error message to the user
        const errorMessage = document.createElement('p');
        errorMessage.textContent = `Unable to fetch cat images: ${error.message}`;
        errorMessage.style.color = 'red';
        catGrid.parentElement.insertBefore(errorMessage, catGrid);
    }
}
