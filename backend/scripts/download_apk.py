import sys 
import asyncio

async def main():
    packageName = sys.argv[1]
    url = sys.argv[2]

    print("Download APK")

    # TODO
    # download apk from url and store its location in filePath

    filePath = '../../backend/scripts/test.xapk'

    proc = await asyncio.create_subprocess_exec("python3", "../../backend/scripts/virus_total.py", packageName, filePath)

    print("End download APK")
    await proc.wait()

if __name__ == "__main__":
	asyncio.run(main())
