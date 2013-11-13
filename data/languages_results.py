import json

def getDiff(char1, char2):
	return (abs(float(char1['evarage_lines']) - float(char2['evarage_lines'])) + abs(float(char1['evarage_curves']) - float(char2['evarage_curves'])))

# def generateCharJson():
inputFile = open('data/output.json')
data = json.load(inputFile)
inputFile.close()

names_arr = []
weights_arr = []
index = 0
languages_info = data['languages']
for language in languages_info:

	index += 1
	lang_name = language['language']
	names_arr.append({"name":lang_name})

	# Now iterate through the rest of the chars and determine link weight
	for i in range(index, len(languages_info)):
		current_lang = languages_info[i]
		weight = getDiff(language, current_lang)
		result_dic = {"source" : lang_name, "target" : current_lang['language'], "value": weight}
		weights_arr.append(result_dic)


outputFile = open('data/languages_char_relation.json', 'w')
outputFile.write('{\n"nodes":')
outputFile.write(json.dumps(names_arr,indent=4))
outputFile.write(',\n"links":')
outputFile.write(json.dumps(weights_arr,indent=4))
outputFile.write('}')

