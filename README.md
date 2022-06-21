## VisualWorld DB project

##Contributors
* Enhao Zhang - Developer
* Yichi Zhang - Front-end Development
* Lyons Lu - Back-end Engineer

##Description
===========
This is a web app built by HTML, CSS, and Python flask framework (using server-side rendering). The purpose for this web app is for annotating datasets for machine learning model training.

The UI consists of two parts: the dashboard on the left and the annotation window on the right. Initially, the annotation window is empty and content will shows up after user clicked the "Fetch Data" button. After user selects desired dataset and a specific video within the selected dataset, the app will fetch a sample selection of frames for the selected video and display them in the annotation window. The app will also draw bounding box for each object appears in a frame.
User can also view the currently selected video by clicking the "View videos" button on the top right corner of the UI.  

###Running the server

In app root directory, run these following commands to start the flask server. 

```javascript
virtualenv env            
source env/bin/activate
pip3 install -r requirement.txt
python3 app.py
```

###How to annotate

After fetched video data, a user will need to click the "Add annotation" button to add a annotation block. In each block, user can select the predicate (currently default to relationship), two objects of interest, and annotation. User can add multiple annotation block to annotate mutliple pairs of objects in a frame. After finish  annotating, click submit annotation to send all annotated data to the server for further processing. 

###Area for future development 

* Expand dataset and video selection
* Allowing user to define predicate 
* Develop API for processing annotation data
* Support more type of annotation
* UI improvement
