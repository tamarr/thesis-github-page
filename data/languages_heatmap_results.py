import json
from numpy import *

# original formula occumulating differences
def getFloatDiff(char1_lines, char1_curves, char2_lines, char2_curves):
    return (abs(char1_lines - char2_lines) + abs(char1_curves - char2_curves))    

def getDiffFromDictionary(char1, char2):
    char1_lines = float(char1['evarage_lines'])
    char1_curves = float(char1['evarage_curves'])
    char2_lines = float(char2['evarage_lines'])
    char2_curves = float(char2['evarage_curves'])
    return distEclud(char1_lines, char1_curves, char2_lines, char2_curves)

# second formula - difference as distance
def distEclud(x1, y1, x2, y2):
    return sqrt(power(x1 - x2, 2) + power(y1 - y2, 2))

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
		weight = 0 if lang1_name == lang2_name else getDiffFromDictionary(language1, language2)
		if weight > maxData: maxData = weight
		row_arr.append([weight, row_index, col_index])
		col_index += 1

	data_arr.append(row_arr)

	for char in language1['chars']:
		charsArr.append(char['char'])

	languages_data[lang1_name] = charsArr
	row_index += 1

# Normalize weights to be from 0 (identity) to 1 (greatest difference)
for row in data_arr:
    for entry in row:
        value = entry[0]
        entry[0] = 0 if value == maxData else (value - maxData)*(-1)/maxData

outputFile = open('data/languages_heatmap.json', 'w')
outputFile.write('{\n"labels":')
outputFile.write(json.dumps(names_arr,indent=4))
outputFile.write(',\n"data":')
outputFile.write(json.dumps(data_arr,indent=4))
outputFile.write(',\n"languages_data":')
outputFile.write(json.dumps(languages_data,indent=4))
outputFile.write(',\n"minData":0,\n"maxData":100')
outputFile.write('\n}')
outputFile.close()

