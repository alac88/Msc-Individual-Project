import sys
import os
import psycopg2

HOST = "localhost"
USER = "postgres"
PASSWORD = "testdb"
DATABASE = "imperial"
PORT = "5432"
TABLE = "public.test4"

API_KEY = 'a01255f309c75b3642163d9a522f1b761a8e7f9327b656031e2b874156336c04'
DOWNLOAD_PATH = os.path.dirname(os.path.abspath(__file__)) + "/download/download_apk.py "


def main():

	virusTotalAnalysis = []
	flowdroidAnalysis = []

	appsList = sys.argv[1].split(",")
	# print(appsList)
	i = 0

	try: 
		while i < len(appsList):
			# print(appsList[i])
			url = getURLFromDatabase(appsList[i])
			# print(url)
			# os.system("python3 /home/al3919/Projects/Msc-Individual-Project/backend/scripts/download/download_apk.py " + url)
			print(DOWNLOAD_PATH)
			os.system("python3 " + DOWNLOAD_PATH + url)
			i += 1

		os.system("sudo docker run --volume=/home/al3919/Projects/Msc-Individual-Project/backend/scripts/download:/apks alexmyg/andropytool -s /apks/ -vt " + API_KEY + " -fw")
		print("ok")

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
