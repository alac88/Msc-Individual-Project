import scrapy

class QuotesSpider(scrapy.Spider):
    name = "quotes"
    start_urls = [
        'https://play.google.com/store/apps/details?id=com.funplus.kingofavalon&hl=fr',
    ]

    def parse(self, response):
        for quote in response.css("div.quote"):
            yield {
                "text": quote.css("span.text::text").get(),
                "author": quote.css("small.author::text").get(),
                "tags": quote.css("div.tags a.tag::text").getall()
            }

        
        # if next_page in response.css("li.next a"):
        #     yield scrapy.follow(next_page, callback=self.parse)