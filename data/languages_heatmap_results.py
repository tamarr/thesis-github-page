import json

def getDiff(char1, char2):
	return (abs(float(char1['evarage_lines']) - float(char2['evarage_lines'])) + abs(float(char1['evarage_curves']) - float(char2['evarage_curves'])))

# def generateCharJson():
inputFile = open('data/output.json')
data = json.load(inputFile)
inputFile.close()

names_arr = []
data_arr = []
maxData = 0
languages_info = data['languages']
row_index = 0
for language1 in languages_info:

	lang1_name = language1['language']
	names_arr.append(lang1_name)
	row_arr = []
	col_index = 0

	# Now iterate through the rest of the chars and determine link weight
	for language2 in languages_info:
		lang2_name = language2['language']
		weight = 0 if lang1_name == lang2_name else getDiff(language1, language2)
		if weight > maxData: maxData = weight
		row_arr.append([weight, row_index, col_index])
		col_index += 1

	data_arr.append(row_arr)
	row_index += 1


outputFile = open('data/languages_heatmap.json', 'w')
outputFile.write('{\n"labels":')
outputFile.write(json.dumps(names_arr,indent=4))
outputFile.write(',\n"data":')
outputFile.write(json.dumps(data_arr,indent=4))
outputFile.write(',\n"minData":0')
outputFile.write(',\n"maxData":{}'.format(maxData))
outputFile.write('}')

