import sys 
import asyncio
from selenium import webdriver
# from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.common.keys import Keys


async def main():
    packageName = sys.argv[1]
    # url = sys.argv[2]
    url = "https://apkpure.com/roamler/net.roamler/download?from=details"

    print("Download APK")

    # TODO
    # download apk from url and store its location in filePath

    options = webdriver.ChromeOptions()

    driver = webdriver.Remote(
        command_executor='http://127.0.0.1:4444/wd/hub',
        desired_capabilities=options.to_capabilities())

    driver.get(url)

    # end

    # filePath = '../../backend/scripts/apk/test.xapk'

    # proc = await asyncio.create_subprocess_exec("python3", "../../backend/scripts/virus_total.py", packageName, filePath)

    # print("End download APK")
    # await proc.wait()

if __name__ == "__main__":
	asyncio.run(main())
