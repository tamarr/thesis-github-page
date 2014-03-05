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

def normalize(maxData, value):
    return 0 if value == maxData else (value - maxData)*(-1)/maxData

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
scripts_info = data['scripts']
scripts_info.sort(key=lambda x: order.index(x["script"]))

names_arr = []
data_arr = []
scripts_data = {}
maxData = 0
row_index = 0
for script1 in scripts_info:

	lang1_name = script1['script']
	names_arr.append(lang1_name)
	row_arr, charsArr = [], []
	col_index = 0

	# Now iterate through the rest of the chars and determine link weight
	for script2 in scripts_info:
		lang2_name = script2['script']
		weight = 0 if lang1_name == lang2_name else getDiffFromDictionary(script1, script2)
		if weight > maxData: maxData = weight
		row_arr.append([weight, row_index, col_index])
		col_index += 1

	data_arr.append(row_arr)

	for char in script1['chars']:
		charsArr.append(char['char'])

	scripts_data[lang1_name] = charsArr
	row_index += 1

# Normalize weights to be from 0 (greatest difference) to 1 (identity)
for row in data_arr:
    for entry in row:
        value = entry[0]
        entry[0] = normalize(maxData, value)

outputFile = open('data/scripts_heatmap.json', 'w')
outputFile.write('{\n"labels":')
outputFile.write(json.dumps(names_arr,indent=4))
outputFile.write(',\n"data":')
outputFile.write(json.dumps(data_arr,indent=4))
outputFile.write(',\n"scripts_data":')
outputFile.write(json.dumps(scripts_data,indent=4))
outputFile.write(',\n"minData":0,\n"maxData":')
outputFile.write(str(maxData))
outputFile.write('\n}')
outputFile.close()

