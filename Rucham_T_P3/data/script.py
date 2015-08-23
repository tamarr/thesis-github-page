import freetype
import codecs
import json

from pattern.web import DOM, TEXT
from pattern.web import Wikipedia
from pattern.db  import Datasheet

engine = Wikipedia(language="en")
language_article = engine.search("Wikipedia", cached=True, timeout=30)
articles_list = language_article.languages
language_family_str = "Language family"
json_data = []
script_json_data = []
script_to_language = {}
language_origins_list = {'language_origins':[]}
script_origins_list = {'script_origins':[]}

lang_list = {'en':'English'}
table = Datasheet.load("language_code_to_name.xsd")
lang_dom = DOM(table.columns[0])
lang_elm_list = lang_dom.by_tag("xs:enumeration")

for lang in lang_elm_list:
    lang_code = lang.attributes.get("value")
    lang_name = lang.by_tag("xs:documentation")
    if lang_code == None or len(lang_name) == 0:
        continue
    if lang_code in articles_list:
        lang_list[lang_code] = lang_name[0].content

for language in lang_list:
    if language == 'eo': continue
    # Get the language article
    language_article = engine.search(lang_list[language]+" language", cached=True, timeout=30)
    if not language_article: continue
    language_dom = DOM(language_article.source)

    # Get script 
    script = language_dom.by_attribute(title='Writing system')
    if not script or len(script) < 1: continue
    script_node = script[0].parent.parent.by_tag('a')
    if len(script_node) < 2:
        continue

    script_name = script_node[1].content

    # Get the script article
    if not 'alphabet' in script_name and not 'script' in script_name and not 'characters' in script_name:
        script_name+=' alphabet'
    if script_name == 'Latin script': script_name == 'Latin alphabet'
    script_article = engine.search(script_name, cached=True, timeout=30)
    if not script_article: continue
    script_dom = DOM(script_article.source)

    script_tree = None
    th_nodes = script_dom.by_tag('th')
    for elm in th_nodes:
        if elm.content == 'Parent systems':
            script_tree = elm
            break
    if not script_tree: continue

    script_tree_node = script_tree.parent 
    nodes = script_tree_node.children
    current_json = script_json_data
    node = None
    current_json_parent = None
    script_origin = None

    # Loop on nodes 
    while nodes:
        # Get the first candidate and remove it from the list
        node = nodes.pop(0)
        if node.type == TEXT and len(node.source) > 1:
            # Ignore irrelevant entries
            content = node.source
            if 'Parent systems' in content or not content[0].isalpha() or content == 'controversial':
                continue

            current_json_parent = current_json

            # The very first origin
            if len(script_json_data) == 0:
                script_json_data.append({'name':content, 'children':[]})
                current_json = script_json_data[0]['children']
            else:
                found = None
                # check if the node already exist in the current json object
                for json_node in current_json:
                    if json_node['name'] == content:
                        current_json = json_node['children']
                        found = True
                        break

                if not found:
                    current_json.append({'name':content, 'children':[]})
                    current_json = current_json[len(current_json)-1]['children']
                
        else:
            nodes.extend(node.children)


    language_tree = language_dom.by_attribute(title=language_family_str)
    if not language_tree or len(language_tree) < 1: continue
    language_tree_node = language_tree[0].parent.parent    
    nodes = language_tree_node.children
    current_json = json_data
    node = None
    current_json_parent = None
    language_origin = None

    # Loop on nodes 
    while nodes:
        # Get the first candidate and remove it from the list
        node = nodes.pop(0)
        if node.type == TEXT and len(node.source) > 1:
            # Ignore irrelevant entries
            content = node.source
            if language_family_str in content or not content[0].isalpha() or content == 'controversial':
                continue

            current_json_parent = current_json

            if not language_origin:
                language_origin = content

            # The very first origin
            if len(json_data) == 0:
                json_data.append({'name':content, 'children':[]})
                current_json = json_data[0]['children']
            else:
                found = None
                # check if the node already exist in the current json object
                for json_node in current_json:
                    if json_node['name'] == content:
                        current_json = json_node['children']
                        found = True
                        break

                if not found:
                    current_json.append({'name':content, 'children':[]})
                    current_json = current_json[len(current_json)-1]['children']
                
        else:
            nodes.extend(node.children)

    current_language_json = current_json_parent[len(current_json_parent)-1]
    # current_json_parent now points to the language we are looking at
    current_language_json['title'] = language_article.title    
    current_language_json['script_name'] = script_name
    current_language_json['script_origin'] = script_origin

    if not script_name in script_to_language:
        script_to_language[script_name] = []
    script_to_language[script_name].append({'name':current_language_json['name'],'origin':language_origin})

for origin in json_data:
    json_file = open(origin['name']+'_language.json', 'wb')
    json.dump(origin, json_file)
    if not origin['name'] in language_origins_list['language_origins']: 
        language_origins_list['language_origins'].append(origin['name'])


for origin in script_json_data:
    json_file = open(origin['name']+'_script.json', 'wb')
    json.dump(origin, json_file)
    if not origin['name'] in script_origins_list['script_origins']: 
        script_origins_list['script_origins'].append(origin['name'])


json_file = open('language_origins_list.json', 'wb')
json.dump(language_origins_list, json_file)

json_file = open('script_origins_list.json', 'wb')
json.dump(script_origins_list, json_file)

json_file = open('script_to_language.json', 'wb')
json.dump(script_to_language, json_file)
