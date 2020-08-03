import scrapy
import asyncio
import psycopg2
import urllib.parse as urlparse
from urllib.parse import parse_qs
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from project.items import GooglePlayItem

# HOST = "localhost"
# USER = "postgres"
# PASSWORD = "testdb"
# DATABASE = "imperial_db"
# PORT = "5432"

HOST = "localhost"
USER = "postgres"
PASSWORD = "testdb"
DATABASE = "imperial_db"
PORT = "5432"

class GooglePlaySpider(CrawlSpider):
    name = "googleplay"
    allowed_domains = ["play.google.com"]
    # start_urls = ['https://play.google.com/store/apps/']
    start_urls = ['https://play.google.com/store/apps/details?id=com.weward&hl=en']
    rules = (
        # Rule(LinkExtractor(allow=('/store/apps',))),
        Rule(LinkExtractor(allow=('/store/apps/details?')), callback='parseUrl'),
        # Rule(LinkExtractor(allow=('/store/apps/details?')), follow=True, callback='parseUrl'),
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


            if not isInDatabase:
                self.addInDatabase(item)
                asyncio.run(self.analyseApp(item["PackageName"], item["APK_URL"]))
            elif isInDatabase and not isLatestVersion:
                self.updateInDatabase(item)
                asyncio.run(self.analyseApp(item["PackageName"], item["APK_URL"]))

        yield item



    def isUpToDate(self, packageName, version):

        conn = psycopg2.connect("host=%s dbname=%s user=%s password=%s port=%s" % (HOST, DATABASE, USER, PASSWORD, PORT))
        # print("Database opened successfully")

        cur = conn.cursor()

        sql_name = "SELECT \"ID\" from public.test4 WHERE \"PACKAGE_NAME\"='%s'" % (packageName)
        cur.execute(sql_name)
        id_name = cur.fetchone()

        if id_name:
            sql_version = "SELECT \"ID\" from public.test4 WHERE \"PACKAGE_NAME\"='%s' AND \"VERSION_APP\"='%s'" % (packageName, version)
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

        sql = "INSERT INTO public.test4(\"PACKAGE_NAME\",\"NAME_APP\", \"UPDATED\", \"SIZE_APP\", \"INSTALLS\", \"VERSION_APP\", \"ANDROID_MIN_VERSION\", \"OFFERED_BY\", \"RATINGS\", \"RATINGS_NUMBER\", \"CATEGORY\", \"PRICE\", \"APK_URL\") VALUES ('%s','%s', '%s', '%s', '%s', '%s', '%s', '%s', %f, '%s', '%s', %f, '%s')" % (item["PackageName"], item["Name"][0].replace("'", " ").replace('"', ' '), item["Updated"][0], item["Size"][0], item["Installs"][0], item["Version"][0], item["AndroidMinVersion"][0], item["OfferedBy"][0], float(item["Ratings"][0].replace(",", " ")), item["RatingsNumber"][0], item["Category"][0], float(item["Price"][0].replace(" Buy", "").replace("€", "")), item["APK_URL"])
        cur.execute(sql)

        conn.commit()
        # print("Record inserted successfully")
        conn.close()

        return True

    def updateInDatabase(self, item):

        conn = psycopg2.connect("host=%s dbname=%s user=%s password=%s port=%s" % (HOST, DATABASE, USER, PASSWORD, PORT))
        # print("Database opened successfully")

        cur = conn.cursor()

        sql = "UPDATE public.test4 SET (\"PACKAGE_NAME\",\"NAME_APP\", \"UPDATED\", \"SIZE_APP\", \"INSTALLS\", \"VERSION_APP\", \"ANDROID_MIN_VERSION\", \"OFFERED_BY\", \"RATINGS\", \"RATINGS_NUMBER\", \"CATEGORY\", \"PRICE\", \"APK_URL\") = ('%s','%s', '%s', '%s', '%s', '%s', '%s', '%s', %f, '%s', '%s', %f, '%s')" % (item["PackageName"], item["Name"][0].replace("'", " ").replace('"', ' '), item["Updated"][0], item["Size"][0], item["Installs"][0], item["Version"][0], item["AndroidMinVersion"][0], item["OfferedBy"][0], float(item["Ratings"][0].replace(",", ".")), item["RatingsNumber"][0], item["Category"][0], float(item["Price"][0].replace(",", ".")), item["APK_URL"])
        cur.execute(sql)

        conn.commit()
        # print("Record updated successfully")
        conn.close()

        return True

    async def analyseApp(self, packageName, url):
        proc = await asyncio.create_subprocess_exec("python3", "../../backend/scripts/download_apk.py", packageName, url)
        await proc.wait()


# # # -- Table: public.test1

# # # -- DROP TABLE public.test1;

# # # CREATE TABLE public.test1
# # # (
# # #     "ID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
# # #     "PACKAGE_NAME" text COLLATE pg_catalog."default",
# # #     "NAME_APP" text COLLATE pg_catalog."default",
# # #     "UPDATED" date,
# # #     "PACKAGE_NAME" text COLLATE pg_catalog."default",
# # #     "INSTALLS" integer,
# # #     "VERSION_APP" text COLLATE pg_catalog."default",
# # #     "ANDROID_MIN_VERSION" text COLLATE pg_catalog."default",
# # #     "OFFERED_BY" text COLLATE pg_catalog."default",
# # #     "RATINGS" double precision,
# # #     "RATINGS_NUMBER" double precision,
# # #     "CATEGORY" text COLLATE pg_catalog."default",
# # #     "PRICE" double precision,
# # #     CONSTRAINT test1_pkey PRIMARY KEY ("ID")
# # # )

# # # TABLESPACE pg_default;

# # # ALTER TABLE public.test1
# # #     OWNER to postgres;

# CREATE TABLE IF NOT EXISTS "public.test4DB" (
# 	"ID" serial,
# 	"PACKAGE_NAME" text,
# 	"NAME_APP" text,
# 	"UPDATED" date,
# 	"SIZE_APP" text,
# 	"INSTALLS" text,
# 	"VERSION_APP" text,
# 	"ANDROID_MIN_VERSION" text,
# 	"OFFERED_BY" text,
# 	"RATINGS" numeric(9,2),
# 	"RATINGS_NUMBER" text,
# 	"CATEGORY" text,
# 	"PRICE" numeric(9,2),
# 	"APK_URL" text,
# 	"VIRUS_TOTAL" jsonb,
# 	PRIMARY KEY( "ID" )
# );