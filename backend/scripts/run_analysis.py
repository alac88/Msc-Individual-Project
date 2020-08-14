import sys
import os
import time
import subprocess
import psycopg2

HOST = "localhost"
USER = "postgres"
PASSWORD = "testdb"
DATABASE = "imperial"
PORT = "5432"
TABLE = "project"

API_KEY = 'a01255f309c75b3642163d9a522f1b761a8e7f9327b656031e2b874156336c04'
DOWNLOAD_PATH = os.path.dirname(os.path.abspath(__file__)) + "/download/download_apk.py"


def main():
	

	appsList = sys.argv[1].split(",")
	i = 0

	try: 
		while i < len(appsList):
			url = getURLFromDatabase(appsList[i])

			p = subprocess.Popen(["python3", DOWNLOAD_PATH, url])
			p.wait()
			i += 1

		q = subprocess.Popen(["sudo", "docker", "run", "--volume=/home/al3919/Projects/Msc-Individual-Project/backend/scripts/download:/apks", "alexmyg/andropytool", "-s", "/apks/", "-vt", API_KEY, "-fw"])
		q.wait()
		print("END")

	except:
		print("Unexpected error:", sys.exc_info()[0])

	return 0

def getURLFromDatabase(packageName):

	conn = psycopg2.connect("host=%s dbname=%s user=%s password=%s port=%s" % (HOST, DATABASE, USER, PASSWORD, PORT))

	cur = conn.cursor()
	sql = "SELECT \"APK_URL\" from " + TABLE + " WHERE \"PACKAGE_NAME\" = '" + packageName + "' "
	cur.execute(sql)

	url = cur.fetchone()

	conn.commit()
	conn.close()

	return url[0]
	
if __name__ == "__main__":
	main()
