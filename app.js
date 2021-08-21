const puppeteer = require ('puppeteer')
const cheerio = require('cheerio')
const { attr } = require('cheerio/lib/api/attributes')

async function scrapeListings(page) {
   
    await page.goto('https://sfbay.craigslist.org/d/jobs/search/eby/jjj')
    
    const html = await page.content()
    const $ = cheerio.load(html)

    const listings = $(".result-info").map((index, element) => {
        const titleElement = $(element).find(".result-title")
        const timeElement = $(element).find(".result-date")
        const hoodElement = $(element).find(".result-hood")
        const title = $(titleElement).text();
        const url = $(titleElement).attr("href")
        const dataPosted = new Date($(timeElement).attr("datetime"))
        const hood = $(hoodElement).text().trim().replace("(","").replace(")","")
        return {title, url, dataPosted, hood}
    })
    return listings


    // await browser.close()
}

async function scrapeJobDescriptions(listings, page) {
 
    for (var i = 0; i < listings.length; i++) {
        await page.goto(listings[i].url)
        const html = await page.content()
        await sleep(1000)
    }
}

async function sleep(miliseconds){
    return new Promise(resolve => setTimeout(resolve, miliseconds))
    
}

async function main () {
    const browser = await puppeteer.launch({headless:false})
    const page = await browser.newPage()
    const listings = await scrapeListings(page)
    const listingsWithJobDescriptions = await scrapeJobDescriptions(listings, page)
    console.log(listings)
}

main()
