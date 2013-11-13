import json

def getDiff(char1, char2):
	return (abs(float(char1['lines']) - float(char2['lines'])) + abs(float(char1['curves']) - float(char2['curves'])))

# def generateCharJson():
inputFile = open('data/output.json')
data = json.load(inputFile)
inputFile.close()

languages_info = data['languages']
for language in languages_info:
	names_arr = []
	weights_arr = []

	index = 0
	chars_arr = language['chars']
	for single_char in chars_arr:
		index += 1
		char_name = single_char['char']
		names_arr.append({"name":char_name})

		# Now iterate through the rest of the chars and determine link weight
		for i in range(index, len(chars_arr)):
			current_char = chars_arr[i]
			weight = getDiff(single_char, current_char)
			result_dic = {"source" : char_name, "target" : current_char['char'], "value": weight}
			weights_arr.append(result_dic)


	outputFile = open('data/ '+language['language'] + '_char_relation.json', 'w')
	outputFile.write('{\n"nodes":')
	outputFile.write(json.dumps(names_arr,indent=4))
	outputFile.write(',\n"links":')
	outputFile.write(json.dumps(weights_arr,indent=4))
	outputFile.write('}')

