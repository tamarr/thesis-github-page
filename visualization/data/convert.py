import json

inputFile = open('countries.json')
data = json.load(inputFile)
inputFile.close()

output = {}

for country in data:
    output[country['ccn3']] = country['cca3']

outputFile = open('countries_mapping.json', 'w')
outputFile.write(json.dumps(output,indent=4))
outputFile.close()