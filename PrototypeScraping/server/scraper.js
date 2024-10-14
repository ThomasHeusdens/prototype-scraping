const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

app.use(express.static('../public'));

app.get('/products', async (req, res) => {
    const { type } = req.query;
    const url = getUrl(type)
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720 });

    await page.goto(url, {
        waitUntil: 'networkidle2',
    });

    async function autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= document.body.scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 200);
            });
        });
    }

    await autoScroll(page);
    await page.waitForSelector('img.tile-image');

    const products = await page.evaluate(() => {
        const items = [];
        const productElements = document.querySelectorAll('.col-lg-3.col-6.product-tile-wrapper');
    
        productElements.forEach(productElement => {
            const contentElement = productElement.querySelector('.product-tile__content');
            const titleElement = contentElement.querySelector('.content__name div:first-child a');
            const typeElement = contentElement.querySelector('.content__name div:last-child a');
            const priceElement = contentElement.querySelector('.product-tile__price .price__sales .value');
            const imageElement = productElement.querySelector('.product-tile__image .image-container a.js-product-tile-link picture img.tile-image');
            const imageLinkElement = productElement.querySelector('.product-tile__image .image-container a.js-product-tile-link');
            
            const title = titleElement ? titleElement.innerText : 'N/A';
            const type = typeElement ? typeElement.innerText : 'N/A';
            const price = priceElement ? priceElement.innerText : 'N/A';
            const imageUrl = imageElement ? imageElement.src : '';
            const imageLink = imageLinkElement ? imageLinkElement.href : '';
    
            if (title !== 'N/A' && type !== 'N/A' && price !== 'N/A') {
                items.push({ title, type, price, imageUrl, imageLink });
            }
        });
    
        return items;
    });  
    console.log(products)
    await browser.close();
    res.json(products);
});

function getUrl(type){
    switch(type) {
        case 'femaleBags':
            return "https://www.torfs.be/fr/femmes/sacs/";
        case 'femaleShoes':
            return "https://www.torfs.be/fr/femmes/chaussures/";
        case 'femaleAccessories':
            return "https://www.torfs.be/fr/femmes/accessoires/"
        case 'maleBags':
            return "https://www.torfs.be/fr/hommes/sacs/"
        case 'maleShoes':
            return "https://www.torfs.be/fr/hommes/chaussures/";
        case 'maleAccessories':
            return "https://www.torfs.be/fr/hommes/accessoires/"
    }
}

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
