import sys 
import subprocess

def main():
    packageName = sys.argv[1]
    url = sys.argv[2]

    # TODO
    # download apk from url and store its location in filePath

    filePath = 'test.xapk'

    subprocess.run(["python3", "virus_total.py", packageName, filePath], check=True)

if __name__ == "__main__":
	main()
