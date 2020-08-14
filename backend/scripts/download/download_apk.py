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
    url = sys.argv[1]

    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
 
    driver = webdriver.Remote(
        command_executor='http://127.0.0.1:4444/wd/hub',
        desired_capabilities=options.to_capabilities())

    driver.get(url)

if __name__ == "__main__":
	main()
