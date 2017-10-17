import pymongo
import json

client = pymongo.MongoClient('mongodb://localhost:27017/APIGateWay')

table = client.rateLimitSetting

"""
Sample Json Format
{
	"array": [
	  {"url": 1,
	  "methodType": 1,
	  "rate": 1,
	  "ceiling": 1,
	  "referenceId": 1
	},
	{"url": 1,
	  "methodType": 1,
	  "rate": 1,
	  "ceiling": 1,
	  "referenceId": 1
	}]
}

"""

def getIrreplacableDict(document):

	return {"url": document["url"],
			"methodType": document["methodType"],
			"referenceId": document["referenceId"]}

def jsonLoad(filename):

	data = dict()

	with open(filename, "r") as f:

		data = json.load(f)

	if data != dict():

		return data[list(data.keys())[0]]

def insertObjects(collection, documents):

	for document in documents:

		irreplaceableDict = getIrreplacableDict(document)

		collection.update_one(irreplaceableDict, {"$set": document}, upsert=True);



