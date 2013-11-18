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

if __name__ == '__main__':
    import numpy
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
                face.load_char(ch)
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
                
                num_contours = len(outline.contours)
                if(num_contours == 0):
                    continue

                total_chars = total_chars + 1
                total_contours = total_contours + num_contours
                total_lines = total_lines + lines
                total_curves = total_curves + curves1+curves2
                char_dic = {"char": ch.encode('utf-8'), "contours": str(num_contours),"lines": str(lines),"curves": str(curves1+curves2)}
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