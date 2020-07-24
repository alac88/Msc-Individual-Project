import scrapy
from scrapy.crawler import CrawlerProcess

def main():
    try:       
        process = CrawlerProcess(get_project_settings())
        process.crawl('googleplay')        
        process.start()
        print ("executed")
        sys.stdout.flush()
    except:
        print ("error")
        
if __name__ == '__main__':
    main()