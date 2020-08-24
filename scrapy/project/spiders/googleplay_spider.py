import scrapy
import asyncio
import psycopg2
import urllib.parse as urlparse
from urllib.parse import parse_qs
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from scrapy.http.request import Request
from project.items import GooglePlayItem

HOST = "localhost"
USER = "postgres"
PASSWORD = "testdb"
DATABASE = "imperial"
PORT = "5432"

class GooglePlaySpider(CrawlSpider):
    name = "googleplay"
    allowed_domains = ["play.google.com", "apkpure.com"]
    start_urls = ['https://play.google.com/store/apps/']
    rules = (
        Rule(LinkExtractor(allow=('/store/apps/details?')), follow=True, callback='parseUrl'),
        )

    def parseName(self, name):
        return name.translate({ord(i): None for i in '$.?,;:/!@=+$#&\'\"'}).lower().replace(" ", "-")


    def parseUrl(self, response):
    # def parse(self, response):

        item = GooglePlayItem()
        parsed = urlparse.urlparse(response.request.url)

        item["PackageName"] = parse_qs(parsed.query)['id'][0]
        item["Version"] = response.xpath('//*[div/text()[contains(., "Current Version" )]]/span/div/span/text()').extract()

        if item["PackageName"] and item["Version"]:
            isInDatabase, isLatestVersion = self.isUpToDate(item["PackageName"], item["Version"][0])


            item["Name"] = response.xpath('//h1[contains(@itemprop, "name")]/span/text()').extract()
            item["Updated"] = response.xpath('//*[div/text()[contains(., "Updated" )]]/span/div/span/text()').extract()
            item["Size"] = response.xpath('//*[div/text()[contains(., "Size" )]]/span/div/span/text()').extract()
            item["Installs"] = response.xpath('//*[div/text()[contains(., "Installs" )]]/span/div/span/text()').extract()
            item["AndroidMinVersion"] = response.xpath('//*[div/text()[contains(., "Requires Android" )]]/span/div/span/text()').extract()
            # item["PermissionsLink"] = response.xpath('').extract()
            item["OfferedBy"] = response.xpath('//*[div/text()[contains(., "Offered By" )]]/span/div/span/text()').extract()
            # item["Developer"] = response.xpath('').extract()
            # item["DeveloperLink"] = response.xpath('').extract()
            # item["DeveloperAddress"] = response.xpath('//*[div/text()[contains(., "Developer" )]]/span/div/span/div[4]/text()').extract()
            item["Ratings"] = response.xpath('//div[contains(@aria-label, "Rated")]/text()').extract()
            item["RatingsNumber"] = response.xpath('(//span[contains(@aria-label, "ratings")])[1]/text()').extract()
            item["Category"] = response.xpath('//a[contains(@itemprop, "genre")]/text()').extract()
            # item["Description"] = response.xpath('').extract()
            item["Price"] = response.xpath('//button[contains(@aria-label, "Buy")]/text()').extract()
            if not item["Price"]:
                item["Price"] = ["0.0"]

            # item["Link"] = response.xpath('').extract()
            item["APK_URL"] = "https://apkpure.com/" + self.parseName(item["Name"][0]) + "/" + item["PackageName"] + "/download?from=details"

            yield Request(item["APK_URL"], callback=self.checkAPKStatus, priority=1, meta={"item":item, "isInDatabase": isInDatabase, "isLatestVersion": isLatestVersion})

        yield item

    def checkAPKStatus(self, response):

        item = response.meta['item']
        isInDatabase = response.meta['isInDatabase']
        isLatestVersion = response.meta['isLatestVersion']

        item["APK_URL_STATUS"] = response.status

        if not isInDatabase:
            self.addInDatabase(item)
        elif isInDatabase and not isLatestVersion:
            self.updateInDatabase(item)
        
        return item

    def isUpToDate(self, packageName, version):

        conn = psycopg2.connect("host=%s dbname=%s user=%s password=%s port=%s" % (HOST, DATABASE, USER, PASSWORD, PORT))
        # print("Database opened successfully")

        cur = conn.cursor()

        sql_name = "SELECT \"ID\" from project WHERE \"PACKAGE_NAME\"='%s'" % (packageName)
        cur.execute(sql_name)
        id_name = cur.fetchone()

        if id_name:
            sql_version = "SELECT \"ID\" from project WHERE \"PACKAGE_NAME\"='%s' AND \"VERSION_APP\"='%s'" % (packageName, version)
            cur.execute(sql_version)
            id_version = cur.fetchone()

            if id_version:
                return True, True
            else:
                return True, False



        conn.commit()
        conn.close()


        return False, False


    def addInDatabase(self, item):

        conn = psycopg2.connect("host=%s dbname=%s user=%s password=%s port=%s" % (HOST, DATABASE, USER, PASSWORD, PORT))

        cur = conn.cursor()

        sql = "INSERT INTO project(\"PACKAGE_NAME\",\"NAME_APP\", \"UPDATED\", \"SIZE_APP\", \"INSTALLS\", \"VERSION_APP\", \"ANDROID_MIN_VERSION\", \"OFFERED_BY\", \"RATINGS\", \"RATINGS_NUMBER\", \"CATEGORY\", \"PRICE\", \"APK_URL\", \"APK_URL_STATUS\") VALUES ('%s','%s', '%s', '%s', '%s', '%s', '%s', '%s', %f, '%s', '%s', %f, '%s', %d)" % (item["PackageName"], item["Name"][0].replace("'", " ").replace('"', ' '), item["Updated"][0], item["Size"][0], item["Installs"][0], item["Version"][0], item["AndroidMinVersion"][0], item["OfferedBy"][0], float(item["Ratings"][0].replace(",", " ")), item["RatingsNumber"][0], item["Category"][0], float(item["Price"][0].replace(" Buy", "").replace("€", "")), item["APK_URL"], item["APK_URL_STATUS"])
        cur.execute(sql)

        conn.commit()
        conn.close()

        return True

    def updateInDatabase(self, item):

        conn = psycopg2.connect("host=%s dbname=%s user=%s password=%s port=%s" % (HOST, DATABASE, USER, PASSWORD, PORT))

        cur = conn.cursor()

        sql = "UPDATE project SET (\"PACKAGE_NAME\",\"NAME_APP\", \"UPDATED\", \"SIZE_APP\", \"INSTALLS\", \"VERSION_APP\", \"ANDROID_MIN_VERSION\", \"OFFERED_BY\", \"RATINGS\", \"RATINGS_NUMBER\", \"CATEGORY\", \"PRICE\", \"APK_URL\", \"APK_URL_STATUS\") = ('%s','%s', '%s', '%s', '%s', '%s', '%s', '%s', %f, '%s', '%s', %f, '%s', %d)" % (item["PackageName"], item["Name"][0].replace("'", " ").replace('"', ' '), item["Updated"][0], item["Size"][0], item["Installs"][0], item["Version"][0], item["AndroidMinVersion"][0], item["OfferedBy"][0], float(item["Ratings"][0].replace(",", ".")), item["RatingsNumber"][0], item["Category"][0], float(item["Price"][0].replace(",", ".")), item["APK_URL"], item["APK_URL_STATUS"])
        cur.execute(sql)

        conn.commit()
        conn.close()

        return True
