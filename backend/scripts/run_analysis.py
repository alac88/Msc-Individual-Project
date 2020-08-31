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
DOWNLOAD_PATH = os.path.dirname(os.path.abspath(__file__)) + "/download"
SAMPLES_PATH = os.path.dirname(os.path.abspath(__file__)) + "/download/samples/"


def main():
	

	appsList = sys.argv[1].split(",")
	typeAnalysis = sys.argv[2]
	i = 0

	try: 
		while i < len(appsList):
			url = getURLFromDatabase(appsList[i])

			# Download APK
			p = subprocess.Popen(["python3", DOWNLOAD_PATH + "/download_apk.py", url])
			p.wait()
			i += 1

		# AndroPyTool analysis
		if typeAnalysis == "Pre-static":
			q = subprocess.Popen(["sudo", "docker", "run", "--volume=" + DOWNLOAD_PATH + ":/apks", "alexmyg/andropytool", "-s", "/apks/", "-vt", API_KEY])
		
		elif typeAnalysis == "Static":
			q = subprocess.Popen(["sudo", "docker", "run", "--volume=" + DOWNLOAD_PATH + ":/apks", "alexmyg/andropytool", "-s", "/apks/", "-fw"])
		
		elif typeAnalysis == "Both":
			q = subprocess.Popen(["sudo", "docker", "run", "--volume=" + DOWNLOAD_PATH + ":/apks", "alexmyg/andropytool", "-s", "/apks/", "-vt", API_KEY, "-fw"])
		
		q.wait()

		# Permissions analysis
		for filename in os.listdir(SAMPLES_PATH):
			r = subprocess.Popen(["apktool", "d", "-o", DOWNLOAD_PATH + "/Permissions/" + filename, SAMPLES_PATH + filename])
			r.wait()

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
