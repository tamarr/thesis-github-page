# coding=UTF8

# -----------------------------------------------------------------------------
#
#  This script was created by Tamar Rucham
#
#  Measures the the algorithm in data_collection and languages_heatmap_results
#
# -----------------------------------------------------------------------------

from freetype import *
from data_collection import CalcChar, scripts

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
    from languages_heatmap_results import getDiffFromDictionary


    face = Face('data/Arial Unicode.ttf')
    face.set_char_size( 48*64 )

    num_iterations = 150

    for scriptName, charsRange in scripts.items():
        total_diff = 0

        for iteration in range(num_iterations):
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
            total_diff += getDiffFromDictionary(slice1, slice2)

        print scriptName, ': ', (total_diff / float(num_iterations))
