Files:

* main.html - the main website page that contains the visualization.
* index.html - the landing page
* README.txt - this file

* js folder:
  ** main.js - the javascript file for the main page
  ** into.js - the javascript file for index.html

* css folder:
  ** style.css - the css file for the main page and shared
  ** intro.css - the css file for Index.html

* data folder:
  ** language_code_to_name.xsd - the file mapping language codes to names
  ** script.py - the python script file to scrap wikipedia and generate the json output
  ** (*)_language.json - a json output file for each language family
  ** (*)_script.json - a json file for each writing script origin
  ** language_origins_list.json -a json file listing all the language origins
  ** script_origins_list.json - a json file listing all the script origins
  ** script_to_language.json - a json file mapping scripts to languages

* lib folder:
  ** d3.v3.min.js - a local copy of d3
  ** jquery.min.js - a local copy of jquery

====================================

How to run the website:

* In order for the website to run the simple python web server needs to be started from the root directory, i.e run the command "python -m SimpleHTTPServer 8888 &" from within the folder
* Browse to localhost:8888  to get to the visualization

====================================

How to generate the data:

* Run python script.py from the data folder. Some manual cleaning up should be done or the results may be incorrect.

====================================

Citation:

Trees are loosly based on the example by Pavan Podila (Jul 20th, 2011) as a blog post in his blog Pixel-In-Gene: http://blog.pixelingene.com/2011/07/building-a-tree-diagram-in-d3-js/

Determining tree size dynamically (line 99) is based of the answer by user Superboggly (Jan 3rd, 2013) in Stackoverflow: http://stackoverflow.com/a/14145316