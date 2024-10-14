document.getElementById('female').addEventListener('click', function () {
    document.querySelector('.gender').style.display = 'none';
    document.querySelector('.female').style.display = 'flex';
});

document.getElementById('male').addEventListener('click', function () {
    document.querySelector('.gender').style.display = 'none'; 
    document.querySelector('.male').style.display = 'flex'; 
});

document.querySelectorAll('.refresh').forEach(button => {
    button.addEventListener('click', function() {
        window.location.reload(); 
    });
});

document.querySelector(".refreshProducts").addEventListener("click", function() {
    window.location.reload();
})

document.querySelectorAll('.female img, .male img').forEach(img => {
    img.addEventListener("click", function () {
        const loadingScreen = document.getElementById('loading');
        const productsContainer = document.getElementById('products');
        document.querySelector(".chose").style.display = 'none';
        document.querySelector("body").style.overflow = 'visible'
        const type = this.id

        loadingScreen.style.display = 'block';
        productsContainer.innerHTML = '';

        fetch(`/products?type=${type}`)
            .then(response => response.json())
            .then(data => {
                loadingScreen.style.display = 'none';
                document.querySelector(".refreshProducts").style.display = "block";

                data.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'product';

                    productDiv.innerHTML = `
                        <div class="product-content">
                            <a href="${product.imageLink}" target="_blank">
                                <img src="${product.imageUrl}" alt="${product.title}">
                                <div class="structure">
                                    <div class="left">
                                        <h2>${product.title}</h2>
                                        <p>${product.type}</p>
                                    </div>
                                    <div class="right">
                                        <h2>${product.price}</h2>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <button onclick="window.open('${product.imageLink}', '_blank');" class="buy-button">BUY IT!</button>
                    `;
                    productsContainer.appendChild(productDiv);
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    })
});
