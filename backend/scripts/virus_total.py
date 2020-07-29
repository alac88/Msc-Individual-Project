import virustotal3.core
import psycopg2
import json
import sys

HOST = "localhost"
USER = "postgres"
PASSWORD = "testdb"
DATABASE = "imperial"
PORT = "5432"

API_KEY = 'a01255f309c75b3642163d9a522f1b761a8e7f9327b656031e2b874156336c04'


def main():
	id = getFileID()

	if id:
		analysis = getFileAnalysis(id)
		# updateInDatabase(analysis)

def getFileID():
	files = virustotal3.core.Files(API_KEY)
	return files.upload(sys.argv[1])['data']['id']


def getFileAnalysis(id):
	analysis = virustotal3.core.get_analysis(API_KEY, id)
	print(analysis)
	print(analysis['data']['attributes']['stats'])
	return analysis['data']['attributes']['stats']

def updateInDatabase(analysis):

	conn = psycopg2.connect("host=%s database=%s user=%s password=%s port=%s" % (HOST, DATABASE, USER, PASSWORD, PORT))

	cur = conn.cursor()

	sql = " UPDATE project SET (\"VIRUS_TOTAL\") = ('%s')" % (analysis)
	cur.execute(sql)

	conn.commit()
	conn.close()

	return True
	
if __name__ == "__main__":
	main()