import json

def getDiff(char1, char2):
	return (abs(float(char1['evarage_lines']) - float(char2['evarage_lines'])) + abs(float(char1['evarage_curves']) - float(char2['evarage_curves'])))

# def generateCharJson():
inputFile = open('data/output.json')
data = json.load(inputFile)
inputFile.close()

order = [
    "Greek", 
    "Latin", 
    "Cyrillic", 
    "Hebrew", 
    "Arabic", 
    "Thai", 
    "Tamil", 
    "Malayalam", 
    "Telugu",
    "Gujarati",
    "Devanagari"
]

# Sort the list by order
languages_info = data['languages']
languages_info.sort(key=lambda x: order.index(x["language"]))

names_arr = []
data_arr = []
languages_data = {}
maxData = 0
row_index = 0
for language1 in languages_info:

	lang1_name = language1['language']
	names_arr.append(lang1_name)
	row_arr, charsArr = [], []
	col_index = 0

	# Now iterate through the rest of the chars and determine link weight
	for language2 in languages_info:
		lang2_name = language2['language']
		weight = 0 if lang1_name == lang2_name else getDiff(language1, language2)
		if weight > maxData: maxData = weight
		row_arr.append([weight, row_index, col_index])
		col_index += 1

	data_arr.append(row_arr)

	for char in language1['chars']:
		charsArr.append(char['char'])

	languages_data[lang1_name] = charsArr
	row_index += 1


outputFile = open('data/languages_heatmap.json', 'w')
outputFile.write('{\n"labels":')
outputFile.write(json.dumps(names_arr,indent=4))
outputFile.write(',\n"data":')
outputFile.write(json.dumps(data_arr,indent=4))
outputFile.write(',\n"languages_data":')
outputFile.write(json.dumps(languages_data,indent=4))
outputFile.write(',\n"minData":0')
outputFile.write(',\n"maxData":{}'.format(maxData))
outputFile.write('\n}')

