import freetype
import codecs
import numpy

from pattern.web import Wikipedia

# Getting the languages
lang_list = {"en":"English","es":"Spanish","pt":"Portuguese","de":"German","fr":"Franch","ms":"Malay","he":"Hebrew","ar":"Arabic","hi":"Hindi","th":"Thai","zh":"Chinese"}

engine = Wikipedia(language="en")
article = engine.search("Wikipedia", cached=True, timeout=30)
articles_list = article.languages

#We need to manually add English to the list since it is the origin
articles_list["en"] = "Wikipedia"

size = 65
face = freetype.Face('/Users/tamarr/Documents/thesis/connected_graph_1/Arial Unicode.ttf')
face.set_char_size( 50*64 )
slot = face.glyph

for language in articles_list:
    
    if not language in lang_list:
        continue

    engine = Wikipedia(language=language)
    article = engine.search(article.languages[language], cached=True, timeout=30)
    
    if len(article.sections) < 1:
        continue

    lines, curves, contours, num_of_chars = 0, 0, 0, 0

    for char in article.sections[0].content:
        if char.isalpha():

            num_of_chars +=1;

            face.load_char(char)
            outline = slot.outline
            points = numpy.array(outline.points, dtype=[('x',float), ('y',float)])
            x, y = points['x'], points['y']

            start, end = 0, 0

            contours += len(outline.contours)
            
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
                        curves+=1
                    else:
                        curves+=1
                start = end+1
    
    print 'language: ', lang_list[language]
    print 'contours: ', (contours/num_of_chars)
    print 'lines: ', (lines/num_of_chars)
    print 'curves: ', (curves/num_of_chars)


    # Write out to file
    '''f1 = open("/Users/tamarr/Documents/thesis/Project II/project2/data/test/"+language+'_letters.json','w')
    f1.write('{\n')
    f1.write('"language_code":"'+language)
    f1.write('",\n"language":"'+lang_list[language])
    f1.write('",\n"width":'+str(width))
    f1.write(',\n"height":'+str(height))
    f1.write(',\n"pixel_letters":[\n')
    x = 0
    pixel_letters_str = ''
    for p in pixel_letters:
        pixel_letters_str += '['
        for l in p:
            pixel_letters_str += '"'+l+'",'
        # Remove last comma if we have any
        if pixel_letters_str[-1:] == ',':
            pixel_letters_str = pixel_letters_str[:-1]
        pixel_letters_str += '],'
        x += 1

    # Remove last comma
    pixel_letters_str = pixel_letters_str[:-1]
    f1.write(pixel_letters_str.encode('utf-8'))
    f1.write('],\n')
    f1.write('"pixel_color":')
    f1.write(str(pixel_color))
    f1.write(',\n')
    f1.write('"letters_count":[')

    count_str = ''
    for l in letters_count:
        count_str += '{"character":"'+l+'","value":'+str(letters_count[l])+'},\n';
    count_str = count_str[:-2]

    f1.write(count_str.encode('utf-8'));
    f1.write(']}')
    f1.close()

    f2 = open("/Users/tamarr/Documents/thesis/Project II/project2/data/test/"+language+'_source.txt','w')
    f2.write(article.sections[0].content.encode('utf-8'))
    f2.close()'''
