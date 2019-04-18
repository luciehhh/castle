const puppeteer = require('puppeteer');
const fs= require('fs');

let bookingUrl = 'https://www.relaischateaux.com/fr/destinations/europe/france';

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(bookingUrl);

    // get hotel details
    let hotelData = await page.evaluate(() => {
        let hotels = [];
		
        // get the hotel elements		
		
        let hotelsElms = document.querySelectorAll('div.no-gutter');
        // get the hotel data
        hotelsElms.forEach((hotelelement) => {
            let hotelJson = {};
            try {
                hotelJson.name = hotelelement.querySelector('div:nth-child(2) > h3 > a > span[itemprop=name]').innerText;
                hotelJson.place = hotelelement.querySelector('div:nth-child(2) > h4 > span:nth-child(1)').innerText;
                hotelJson.price = hotelelement.querySelector('div:nth-child(2) > div.priceTag > div > span.price > span.price').innerText;
				hotelJson.type = hotelelement.querySelector('div:nth-child(1) > div > div > div > div.slick-slide.slick-active > div > span').innerText;
				
            }
            catch (exception){

            }
			if(hotelJson.type === "Hôtel + Restaurant"){
            hotels.push(hotelJson);
			}
			
			
			//hotels.push(hotelJson);
			
        });
        return hotels;
    });

    console.dir(hotelData);
	
	fs.writeFile(
	'./hotels.json',
	JSON.stringify(hotelData,null,2),
	(err) => err ? console.error('Data not written!', err) : console.log('Data written!')
	)
	
})();

