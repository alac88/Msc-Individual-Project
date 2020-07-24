import scrapy
import psycopg2
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from project.items import GooglePlayItem


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

        sql_name = "SELECT \"ID\" from public.test3 WHERE \"PACKAGE_NAME\"='%s'" % (packageName)
        cur.execute(sql_name)
        id_name = cur.fetchone()
        
        if id_name:
            sql_version = "SELECT \"ID\" from public.test3 WHERE \"PACKAGE_NAME\"='%s' AND \"VERSION_APP\"='%s'" % (packageName, version)
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

        # print(item)

        # print(item["PackageName"])
        # print(item["Name"][0])
        # print(item["Updated"][0])
        # print(item["Size"][0])
        # print(int(item["Installs"][0].replace(",","").replace("+","")))
        # print(item["Version"][0])
        # print(item["AndroidMinVersion"][0])
        # print(item["OfferedBy"][0])
        # print(float(item["Ratings"][0].replace(",", ".")))
        # print(float(item["RatingsNumber"][0].replace(",", ".")))
        # print(item["Category"][0])
        # print(float(item["Price"][0].replace(" Buy", "").replace("€", "")))
        # print(item["APK_URL"])

        conn = psycopg2.connect("host=%s dbname=%s user=%s password=%s port=%s" % (HOST, DATABASE, USER, PASSWORD, PORT))
        # print("Database opened successfully")
        
        cur = conn.cursor()

        sql = "INSERT INTO public.test3(\"PACKAGE_NAME\",\"NAME_APP\", \"UPDATED\", \"SIZE_APP\", \"INSTALLS\", \"VERSION_APP\", \"ANDROID_MIN_VERSION\", \"OFFERED_BY\", \"RATINGS\", \"RATINGS_NUMBER\", \"CATEGORY\", \"PRICE\", \"APK_URL\") VALUES ('%s','%s', '%s', '%s', '%d', '%s', '%s', '%s', %f, %f, '%s', %f, '%s')" % (item["PackageName"], item["Name"][0], item["Updated"][0], item["Size"][0], int(item["Installs"][0].replace(",","").replace("+","")), item["Version"][0], item["AndroidMinVersion"][0], item["OfferedBy"][0], float(item["Ratings"][0].replace(",", ".")), float(item["RatingsNumber"][0].replace(",", ".")), item["Category"][0], float(item["Price"][0].replace(" Buy", "").replace("€", "")), item["APK_URL"])
        cur.execute(sql)
        
        conn.commit()
        # print("Record inserted successfully")
        conn.close()

        return True

    def updateInDatabase(self, item):

        conn = psycopg2.connect("host=%s database=%s user=%s password=%s port=%s" % (HOST, DATABASE, USER, PASSWORD, PORT))
        # print("Database opened successfully")
        
        cur = conn.cursor()

        sql = "UPDATE public.test3 SET (\"PACKAGE_NAME\",\"NAME_APP\", \"UPDATED\", \"SIZE_APP\", \"INSTALLS\", \"VERSION_APP\", \"ANDROID_MIN_VERSION\", \"OFFERED_BY\", \"RATINGS\", \"RATINGS_NUMBER\", \"CATEGORY\", \"PRICE\", \"APK_URL\") = ('%s','%s', '%s', '%s', '%s', '%s', '%s', '%s', %f, %f, '%s', %f, '%s')" % (item["PackageName"], item["Name"][0], item["Updated"][0], item["Size"][0], item["Installs"][0], item["Version"][0], item["AndroidMinVersion"][0], item["OfferedBy"][0], float(item["Ratings"][0].replace(",", ".")), float(item["RatingsNumber"][0].replace(",", ".")), item["Category"][0], float(item["Price"][0].replace(",", ".")), item["APK_URL"])
        cur.execute(sql)
        
        conn.commit()
        # print("Record UPDATED successfully")
        conn.close()

        return True


# # -- Table: public.test1

# # -- DROP TABLE public.test1;

# # CREATE TABLE public.test1
# # (
# #     "ID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
# #     "package_name" text COLLATE pg_catalog."default",
# #     "name_app" text COLLATE pg_catalog."default",
# #     "updated" date,
# #     "size_app" text COLLATE pg_catalog."default",
# #     "INSTALLS" integer,
# #     "version_app" text COLLATE pg_catalog."default",
# #     "android_min_version" text COLLATE pg_catalog."default",
# #     "offered_by" text COLLATE pg_catalog."default",
# #     "ratings" double precision,
# #     "ratings_number" double precision,
# #     "category" text COLLATE pg_catalog."default",
# #     "price" double precision,
# #     CONSTRAINT test1_pkey PRIMARY KEY ("ID")
# # )

# # TABLESPACE pg_default;

# # ALTER TABLE public.test1
# #     OWNER to postgres;

# CREATE TABLE IF NOT EXISTS "project" (
# 	"id" serial,
# 	"package_name" text,
# 	"name_app" text,
# 	"updated" date,
# 	"size_app" text,
# 	"installs" numeric(9,2),
# 	"version_app" text,
# 	"android_min_version" text,
# 	"offered_by" text,
# 	"ratings" numeric(9,2),
# 	"ratings_number" numeric(9,2),
# 	"category" text,
# 	"price" numeric(9,2),
# 	"apk_url" text,
# 	PRIMARY KEY( id )
# );