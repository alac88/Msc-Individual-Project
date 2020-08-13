import sys 
import os
import time
import shutil
import asyncio
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def main():
    # packageName = sys.argv[1]
    url = sys.argv[1]

    # print("download_apk.py entered with url: ", url)

    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    # prefs = {'download.default_directory' : '/Users/alexandrelac/Documents/Projects/Individual/Msc-Individual-Project/backend/scripts/apk'}; 
    # options.add_experimental_option('prefs', prefs)


    driver = webdriver.Remote(
        command_executor='http://127.0.0.1:4444/wd/hub',
        desired_capabilities=options.to_capabilities())

    driver.get(url)

    # try:
        # element = WebDriverWait(driver, 10).until(
        #     EC.presence_of_element_located((By.ID, "download_link"))
        # )

        # element.click()

    # driver.implicitly_wait(5)

    # initialPath = "/Users/alexandrelac/Documents/Projects/Individual/Msc-Individual-Project/backend/scripts/download/"

    # filename = max([initialPath + f for f in os.listdir(initialPath) if (f.find(".apk") + f.find(".xapk")) >= 0], key=os.path.getctime)
    
    # filePath = initialPath + filename

    # change path
        # VirusTotal Analysis
        # proc = await asyncio.create_subprocess_exec("python3", "../../backend/scripts/analysis/virus_total.py", packageName, filePath)
        # await proc.wait()
        # os.system("python3 ../../backend/scripts/analysis/virus_total.py " + packageName + " " + filePath)


    # finally:
    #     driver.quit()
        


if __name__ == "__main__":
	main()
