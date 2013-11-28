# coding=UTF8

# -----------------------------------------------------------------------------
#
#  This script was created by Tamar Rucham, based on the FreeType library example 
#  glyph_vector.py
#
#  Assuming the ttf file and input file in a data folder from currently run script
#  this script will generate the statistics for each character in the given ranges
#  for the given languages, as well as general statistics for the language
#
# -----------------------------------------------------------------------------

from freetype import *
import numpy

scripts = {
        'Latin': range(0x0041,0x005A) + range(0x0061, 0x007A),
        'Greek': range(0x0391,0x03A9) + range(0x03B1, 0x03C9),
        'Cryllic': range(0x0410,0x044F),
        'Hebrew': range(0x05D0,0x05EA),
        'Arabic': range(0x0621,0x063A) + range(0x0641, 0x064A),
        'Thai': range(0x0E01,0x0E2F) + range(0x0E40, 0x0E44),
        'Tamil': range(0x0B85,0x0B8A) + range(0x0B8E, 0x0B90) + range(0x0B92, 0x0B95)
                + range(0x0B99, 0x0B9A) + range(0x0BA3, 0x0BA4) + range(0x0BA8, 0x0BAA) + range(0x0BAE, 0x0BB9),
        'Malayalam': range(0x0D05,0x0D0C) + range(0x0D0E, 0x0D10) + range(0x0D12, 0x0D3A),
        'Telugu': range(0x0C05,0x0C0C) + range(0x0C0E, 0x0C10) + range(0x0C12, 0x0C28)
                 + range(0x0C2A, 0x0C33) + range(0x0C35, 0x0C39),
        'Gujarati': range(0x0A85,0x0A8D) + range(0x0A8F, 0x0A91) + range(0x0A93, 0x0AA8) + range(0x0AAA, 0x0AB0)
                 + range(0x0AB2, 0x0AB3) + range(0x0AB5, 0x0AB9),
        'Devanagari': range(0x0904,0x0939) + range(0x0958, 0x0961)
}

def CalcChar(singleChar, face):
    face.load_char(singleChar)
    slot = face.glyph

    outline = slot.outline
    points = numpy.array(outline.points, dtype=[('x',float), ('y',float)])
    x, y = points['x'], points['y']

    start, end = 0, 0
    lines, curves1, curves2 = 0, 0, 0

    # Iterate over each contour
    for i in range(len(outline.contours)):
        end    = outline.contours[i]
        points = outline.points[start:end+1] 
        points.append(points[0])
        tags   = outline.tags[start:end+1]
        tags.append(tags[0])

        segments = [ [points[0],], ]

        for j in range(1, len(points) ):
            segments[-1].append(points[j])
            if tags[j] & (1 << 0) and j < (len(points)-1):
                segments.append( [points[j],] )
        for segment in segments:
            if len(segment) == 2:
                lines+=1
            elif len(segment) == 3:
                curves1+=1
            else:
                # as reference - inner curves for complex curves
                for i in range(1,len(segment)-2):
                    A,B = segment[i], segment[i+1]
                    C = ((A[0]+B[0])/2.0, (A[1]+B[1])/2.0)
                curves2+=1
        start = end+1

    return len(outline.contours), lines, (curves1 + curves2)

if __name__ == '__main__':
    import json

    face = Face('data/Arial Unicode.ttf')
    face.set_char_size( 48*64 )

    inputFile = open('data/input.json')
    data = json.load(inputFile)
    inputFile.close()

    languages_arr = []
    for language in data['languages']:
        if "Arial" in language and language["Arial"] == False: continue
        print language['language']
        language_dic = {"language": language['language'], "chars": []}

        total_chars, total_contours, total_lines, total_curves = 0,0,0,0

        ranges = language['ranges']
        for char_range in ranges:
            char1 = char_range[0]
            char2 = char_range[1] if len(char_range) > 1 else char1
            for i in range(int(char1,0),int(char2, 0)+1):
                ch = unichr(i)
                contours, lines, curves = CalcChar(ch, face)

                total_chars = total_chars + 1
                total_contours = total_contours + contours
                total_lines = total_lines + lines
                total_curves = total_curves + curves
                char_dic = {"char": ch.encode('utf-8'), "contours": str(contours),
                            "lines": str(lines),"curves": str(curves)}
                language_dic["chars"].append(char_dic)

        total_chars = float(total_chars)
        language_dic["total_chars"] = total_chars
        language_dic["total_contours"] = total_contours
        language_dic["evarage_contours"] = (total_contours/total_chars)
        language_dic["total_lines"] = total_lines
        language_dic["evarage_lines"] = (total_lines/total_chars)
        language_dic["total_curves"] = total_curves
        language_dic["evarage_curves"] = (total_curves / total_chars)
        languages_arr.append(language_dic)

    outputFile = open('data/output.json','w')
    outputFile.write('{\n"languages":')
    outputFile.write(json.dumps(languages_arr,indent=4))
    outputFile.write('}')
    outputFile.close()