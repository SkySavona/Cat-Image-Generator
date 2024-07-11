// // tagFetcher.js
// async function fetchTags() {
//     const response = await fetch('https://cataas.com/api/tags');
//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.json();
// }

// function setupTagSuggestions() {
//     const categoryInput = document.getElementById('category');
//     const suggestionsDiv = document.createElement('div');
//     suggestionsDiv.id = 'tag-suggestions';
//     categoryInput.parentNode.insertBefore(suggestionsDiv, categoryInput.nextSibling);

//     let tags = [];

//     fetchTags().then(fetchedTags => {
//         tags = fetchedTags;
//     }).catch(error => {
//         console.error('Error fetching tags:', error);
//     });

//     categoryInput.addEventListener('input', () => {
//         const value = categoryInput.value.toLowerCase();
//         const matchingTags = tags.filter(tag => tag.toLowerCase().includes(value));
        
//         suggestionsDiv.innerHTML = '';
//         matchingTags.slice(0, 5).forEach(tag => {
//             const suggestion = document.createElement('div');
//             suggestion.textContent = tag;
//             suggestion.addEventListener('click', () => {
//                 categoryInput.value = tag;
//                 suggestionsDiv.innerHTML = '';
//             });
//             suggestionsDiv.appendChild(suggestion);
//         });
//     });
// }

// document.addEventListener('DOMContentLoaded', setupTagSuggestions);