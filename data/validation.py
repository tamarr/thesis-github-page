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
from data_collection import CalcChar

def run(chars, face):
    total_chars, total_contours, total_lines, total_curves = 0,0,0,0

    for singleChar in chars:
        ch = unichr(singleChar)
        contours, lines, curves = CalcChar(ch, face)

        total_chars = total_chars + 1
        total_contours = total_contours + contours
        total_lines = total_lines + lines
        total_curves = total_curves + curves

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
        diff = 0

        # Create two random subsets of the characters
        charsSlice1 = copy.deepcopy(charsRange)
        charsSlice2 = []
        for i in range(len(charsRange) / 2):
            # Dynamically get the len of the remaining of the array
            randIdx = random.randint(0, len(charsSlice1) - 1)
            charsSlice2.append(charsSlice1.pop(randIdx))

        slice1 = run(charsSlice1, face)
        slice2 = run(charsSlice2, face)
        diff += getDiff(slice1, slice2)
        print diff
        total_diff += diff

    print 'average diff: ', (total_diff / float(num_iterations))
