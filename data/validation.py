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

def run(chars):
    total_chars, total_contours, total_lines, total_curves = 0,0,0,0

    for singleChar in chars:
        ch = unichr(singleChar)
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

    return {'evarage_lines': float(total_lines)/float(total_chars), 'evarage_curves': float(total_curves) / float(total_chars)}

if __name__ == '__main__':
    import numpy
    import json
    import copy
    import random
    from languages_heatmap_results import getDiff

    face = Face('data/Arial Unicode.ttf')
    face.set_char_size( 48*64 )

    num_iterations = 15
    total_diff = 0

    charsRange = range(0x0041,0x005A) + range(0x0061, 0x007A)
    for iteration in range(15):
        print 'iteration: ', iteration

        # Create two random subsets of the characters
        charsSlice1 = copy.deepcopy(charsRange)
        charsSlice2 = []
        for i in range(len(charsRange) / 2):
            # Dynamically get the len of the remaining of the array
            randIdx = random.randint(0, len(charsSlice1) - 1)
            charsSlice2.append(charsSlice1.pop(randIdx))

        slice1 = run(charsSlice1)
        slice2 = run(charsSlice2)
        total_diff += getDiff(slice1, slice2)
        print total_diff

    print 'average diff: ', (total_diff / float(num_iterations))
