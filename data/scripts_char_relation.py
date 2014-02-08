if __name__ == '__main__':
    import json

    inputFile = open('data/output.json')
    data = json.load(inputFile)
    inputFile.close()

    for script in data['scripts']:
        name = script['script']
        outputFile = open('data/chars/'+name+'_chars.json', 'w')
        outputFile.write(json.dumps({'name':name, 'chars':script['chars']},indent=4))
        outputFile.close()


