import scrapy
import psycopg2
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from project.items import GooglePlayItem


HOST = "db.doc.ic.ac.uk"
USER = "al3919"
PASSWORD = "MfApFfQs5P"
DATABASE = "al3919"
PORT = "5432"

class GooglePlaySpider(CrawlSpider):
    name = "googleplay"
    allowed_domains = ["play.google.com"]
    # start_urls = ['https://play.google.com/store/apps/']
    start_urls = ['https://play.google.com/store/apps/details?id=com.weward&hl=en']
    rules = (
        # Rule(LinkExtractor(allow=('/store/apps',))),
        # Rule(LinkExtractor(allow=('/store/apps/details?')), callback='parseUrl'),
        Rule(LinkExtractor(allow=('/store/apps/details?')), follow=True, callback='parseUrl'),
        )

    def parseName(self, name):
        return name.translate({ord(i): None for i in '$.?,;:/!@=+$#&'}).lower().replace(" ", "-")


    def parseUrl(self, response):
    # def parse(self, response):

        item = GooglePlayItem()

        item["PackageName"] = response.xpath('//button[contains(@aria-label, "Install") or contains(@aria-label, "Buy")]/@data-item-id').extract()[0].split('"')[1]
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


            if not isInDatabase:
                # print("Add in DB")
                self.addInDatabase(item)
                elif isInDatabase and not isLatestVersion:
                # print("Update in DB")
                self.updateInDatabase(item)
            # else:
                # print("Nothing to do")

        yield item



    def isUpToDate(self, packageName, version):

        conn = psycopg2.connect("host=%s dbname=%s user=%s password=%s port=%s" % (HOST, DATABASE, USER, PASSWORD, PORT))
        # print("Database opened successfully")

        cur = conn.cursor()

        sql_name = "SELECT \"id\" from project WHERE \"package_name\"='%s'" % (packageName)
        cur.execute(sql_name)
        id_name = cur.fetchone()

        if id_name:
            sql_version = "SELECT \"id\" from project WHERE \"package_name\"='%s' AND \"version_app\"='%s'" % (packageName, version)
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
        # print("Database opened successfully")

        cur = conn.cursor()

        sql = "INSERT INTO project(\"package_name\",\"name_app\", \"updated\", \"size_app\", \"installs\", \"version_app\", \"android_min_version\", \"offered_by\", \"ratings\",$
        cur.execute(sql)

        conn.commit()
        # print("Record inserted successfully")
        conn.close()

        return True

    def updateInDatabase(self, item):

        conn = psycopg2.connect("host=%s database=%s user=%s password=%s port=%s" % (HOST, DATABASE, USER, PASSWORD, PORT))
        # print("Database opened successfully")

        cur = conn.cursor()

        sql = "UPDATE project SET (\"package_name\",\"name_app\", \"updated\", \"size_app\", \"INSTALLS\", \"version_app\", \"android_min_version\", \"offered_by\", \"ratings\",$
        cur.execute(sql)

        conn.commit()
        # print("Record updated successfully")
        conn.close()

        return True