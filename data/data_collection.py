# coding=UTF8

# -----------------------------------------------------------------------------
#
#  FreeType high-level python API - Copyright 2011 Nicolas P. Rougier
#  Distributed under the terms of the new BSD license.
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

    outputFile = open('data/output.json','w')
    outputFile.write('{\n"languages": [')
    for language in data['languages']:

        outputFile.write('\n{"language": "' + language['language'] +'",')
        outputFile.write('\n"chars":[')

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
                outputFile.write('\n{"char": "' + ch.encode('utf-8') + '",')
                outputFile.write('\n"contours": ' + str(num_contours) + ',')
                outputFile.write('\n"lines": ' + str(lines) + ',')
                outputFile.write('\n"curves": ' + str(curves1+curves2) + '}')

        total_chars = float(total_chars)
        outputFile.write('\n],')
        outputFile.write('\n"total_chars": ' + str(total_chars) + ',')
        outputFile.write('\n"total_contours": ' + str(total_contours) + ',')
        outputFile.write('\n"evarage_contours": ' + str(total_contours/total_chars) + ',')
        outputFile.write('\n"total_lines": ' + str(total_lines) + ',')
        outputFile.write('\n"evarage_lines": ' + str(total_lines/total_chars) + ',')
        outputFile.write('\n"total_curves": ' + str(total_curves) + ',')
        outputFile.write('\n"evarage_curves": ' + str(total_curves / total_chars))
        outputFile.write('},')

    outputFile.write('\n]\n}')
    outputFile.close()