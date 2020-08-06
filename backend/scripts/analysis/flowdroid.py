import virustotal3.core
import psycopg2
import json
import sys

HOST = "localhost"
USER = "postgres"
PASSWORD = "testdb"
DATABASE = "imperial"
PORT = "5432"

def main():
	print("Flowdroid")

    try:
        analysis = getFileAnalysis()
        print(analysis)
        # updateInDatabase(analysis)

# def getFileID():
# 	files = virustotal3.core.Files(API_KEY)
# 	print("path: " + sys.argv[2])
# 	return files.upload(sys.argv[2])['data']['id']


def getFileAnalysis(id):
	# analysis = virustotal3.core.get_analysis(API_KEY, id)
	# return analysis['data']['attributes']

def updateInDatabase(analysis):

	conn = psycopg2.connect("host=%s dbname=%s user=%s password=%s port=%s" % (HOST, DATABASE, USER, PASSWORD, PORT))

	cur = conn.cursor()
	print("update DB with flowdroid")
	sql = "UPDATE project SET \"FLOWDROID\" = \'" + str(analysis).replace("\'", "\"" ).replace("None", "\"None\"") + "\' WHERE \"PACKAGE_NAME\" = '" + sys.argv[1] + "' "
	print(sql)
	cur.execute(sql)

	conn.commit()
	conn.close()

	return True
	
if __name__ == "__main__":
	main()
