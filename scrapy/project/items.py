# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class GooglePlayItem(scrapy.Item):
    Name = scrapy.Field()
    PackageName = scrapy.Field()
    Updated = scrapy.Field()
    Size = scrapy.Field()
    Installs = scrapy.Field()
    Version = scrapy.Field()
    AndroidMinVersion = scrapy.Field()
    PermissionsLink = scrapy.Field()
    OfferedBy = scrapy.Field()
    Developer = scrapy.Field()
    DeveloperLink = scrapy.Field()
    DeveloperAddress = scrapy.Field()
    Ratings = scrapy.Field()
    RatingsNumber = scrapy.Field()
    Category = scrapy.Field()
    Description = scrapy.Field()
    Price = scrapy.Field()
    Link = scrapy.Field()
    APK_URL = scrapy.Field()
    APK_URL_STATUS = scrapy.Field()
