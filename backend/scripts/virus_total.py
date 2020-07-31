import virustotal3.core
import psycopg2
import json
import sys

HOST = "localhost"
USER = "postgres"
PASSWORD = "testdb"
DATABASE = "imperial_db"
PORT = "5432"

API_KEY = 'a01255f309c75b3642163d9a522f1b761a8e7f9327b656031e2b874156336c04'


def main():
	id = getFileID()

	if id:
		analysis = getFileAnalysis(id)
		updateInDatabase(analysis)

def getFileID():
	files = virustotal3.core.Files(API_KEY)
	return files.upload(sys.argv[2])['data']['id']


def getFileAnalysis(id):
	analysis = virustotal3.core.get_analysis(API_KEY, id)
	return analysis['data']['attributes']

def updateInDatabase(analysis):

	conn = psycopg2.connect("host=%s dbname=%s user=%s password=%s port=%s" % (HOST, DATABASE, USER, PASSWORD, PORT))

	cur = conn.cursor()

	sql = "UPDATE public.test3 SET \"VIRUS_TOTAL\" = \'" + str(analysis).replace("\'", "\"" ).replace("None", "\"None\"") + "\' WHERE \"PACKAGE_NAME\" = '" + sys.argv[1] + "' "
	cur.execute(sql)

	conn.commit()
	conn.close()

	return True
	
if __name__ == "__main__":
	main()
