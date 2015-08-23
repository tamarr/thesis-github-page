Files:

* Index.html - the main website page that contains the small multiple, a description and the video.
* project2.html - the page to represent a specific text blob based on a url query string "lang=en" for example
* README.txt - this file
* js folder:
  ** main.js - the javascript file for the main page
  ** project2.js - the javascript file for project2.html
* css folder:
  ** style.css - the css file for the entire website
* data folder:
  ** Arial Unicode.ttf - the true type font library
  ** script.py - the python script file to scrap wikipedia and generate the json output
  ** language_letters.json - a json output file for each language
  ** language_source.txt - a text output file for each language
* lib folder:
  ** d3.v3.min.js - a local copy of d3
  ** jquery.min.js - a local copy of jquery

====================================

How to run the website:

* In order for the website to run the simple python web server needs to be started from the root directory, i.e run the command "python -m SimpleHTTPServer 8888 &" from the folder named project2
* Browse to localhost:8888  to get to the project landing page
* For a specific language page - if not reached from the landing page - you will have to add the language code in the query string, for example for English go to: http://localhost:8888/project2.html?lang=en  Since all languages are linked from the home page this is only relevant if you wish to observe a new language as described in the next section.

====================================

How to generate the data:

* Ensure freetype-py is installed (http://code.google.com/p/freetype-py/). It should be installed by default on Macs.
* Run python script.py from the data folder.

* Note: processing the chinese data takes a *very* long time, you may want to remove it from lang_list
* If there is a different language you are interested in viewing - simply add it to the array. If there is a wikipedia article in that language and the Arial Unicode fft file supports it, the data will be generated and can be viewed by browsing to http://localhost:8888/project2.html?lang=your_language_code
* If the language you wish to explore is not supported by the Arial Unicode file, you can swap it to a different one. On mac you can view the different fonts and which language they support using the built in Font Book application.