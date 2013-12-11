if __name__ == '__main__':
    import json

    inputFile = open('data/output.json')
    data = json.load(inputFile)
    inputFile.close()

    for script in data['languages']:
        name = script['language']
        outputFile = open('data/'+name+'_chars.json', 'w')
        outputFile.write(json.dumps({'name':name, 'chars':script['chars']},indent=4))
        outputFile.close()


