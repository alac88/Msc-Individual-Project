import sys
import os
import psycopg2
# import download_apk

HOST = "localhost"
USER = "postgres"
PASSWORD = "testdb"
DATABASE = "imperial"
PORT = "5432"
TABLE = "project"

API_KEY = 'a01255f309c75b3642163d9a522f1b761a8e7f9327b656031e2b874156336c04'


def main():

	virusTotalAnalysis = []
	flowdroidAnalysis = []

	appsList = sys.argv[1].split(",")
	# print(appsList)
	i = 0
	while i < len(appsList):
		# print(appsList[i])
		url = getURLFromDatabase(appsList[i])
		# print(url)
		os.system("python3 /home/al3919/Projects/Msc-Individual-Project/backend/scripts/download/download_apk.py " + url)
		# os.system("python3 /Users/alexandrelac/Documents/Projects/Individual/Msc-Individual-Project/backend/scripts/download/download_apk.py " + url)
		i += 1

	# os.system("sudo docker run --volume=/home/al3919/Projects/Msc-Individual-Project/backend/scripts/download:/apks alexmyg/andropytool -s /apks/ -all")

	print("ok")
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
