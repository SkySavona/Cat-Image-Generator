function generateCats() {
    const category = document.getElementById('category').value;
    const imagesDiv = document.getElementById('cat-images');
    imagesDiv.innerHTML = ''; // Clear previous images

    for (let i = 0; i < 6; i++) {
        fetch(`https://cataas.com/cat/${category}?json=true`)
            .then(response => response.json())
            .then(data => {
                const img = document.createElement('img');
                img.src = `https://cataas.com${data.url}`;
                imagesDiv.appendChild(img);
            })
            .catch(error => {
                console.error('Error fetching cat image:', error);
            });
    }
}
