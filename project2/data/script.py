import freetype
import codecs

from pattern.web import Wikipedia

# Getting the languages
lang_list = {"en":"English","es":"Spanish","pt":"Portuguese","de":"German","fr":"Franch","ms":"Malay","he":"Hebrew","ar":"Arabic","hi":"Hindi","th":"Thai","zh":"Chinese"}

engine = Wikipedia(language="en")
article = engine.search("Wikipedia", cached=True, timeout=30)
articles_list = article.languages

#We need to manually add English to the list since it is the origin
articles_list["en"] = "Wikipedia"

size = 65
face = freetype.Face('Arial Unicode.ttf')
face.set_char_size( 50*64 )
slot = face.glyph

for language in articles_list:
    
    if not language in lang_list:
        continue

    engine = Wikipedia(language=language)
    article = engine.search(article.languages[language], cached=True, timeout=30)
    
    if len(article.sections) < 1:
        continue

    # First pass to compute bbox
    width, height, baseline = 0, 0, 0
    for i,c in enumerate(article.sections[0].content):
        if c.isalpha():
            face.load_char(c)
            bitmap = slot.bitmap
            height = max(height,
                         bitmap.rows + max(0,-(slot.bitmap_top-bitmap.rows)))
            baseline = max(baseline, max(0,-(slot.bitmap_top-bitmap.rows)))
            width = max(width, bitmap.width)

    # Initialize our arrays
    pixel_letters = []
    pixel_color = []
    letters_count = {}
    for i in range(size*size):
        pixel_color.append(0)
        pixel_letters.append([])

    x,y = 0,0
    for char in article.sections[0].content:
        if char.isalpha():

            face.load_char(char)
            bitmap = slot.bitmap

            top = slot.bitmap_top
            left = slot.bitmap_left
            w,h = bitmap.width, bitmap.rows
            y = height-baseline-top

            # Add margin to center all letters in square
            i = 1
            row = y
            for pixel in bitmap.buffer:
                if i == 0:
                    start = 0
                else:
                    start = (row)*size + i%w

                # Count pixels and letters per pixel
                if (pixel > 0):
                    pixel_color[start]+=1
                    if not char in pixel_letters[start]:
                        pixel_letters[start].append(char)

                if not i == 0 and (i%w == 0):
                    row += 1
                i+=1

            x += (slot.advance.x >> 6) 


            # count overall character appearance
            if not char in letters_count:
                letters_count[char] = 1
            else:
                letters_count[char] += 1

    # Write out to file
    f1 = open(language+'_letters.json','w')
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

    f2 = open(language+'_source.txt','w')
    f2.write(article.sections[0].content.encode('utf-8'))
    f2.close()
