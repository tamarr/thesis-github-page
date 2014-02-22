import json

inputFile = open('countries.json')
data = json.load(inputFile)
inputFile.close()

output = {}

for country in data:
    output[int(country['ccn3'])] = {'alphaCode': country['cca3'], 'region': country['region']}

outputFile = open('countries_mapping.json', 'w')
outputFile.write(json.dumps(output,indent=4))
outputFile.close()