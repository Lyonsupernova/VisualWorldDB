
from datetime import timedelta
import flask
import os
import random
import cv2
import json
from moviepy.editor import VideoFileClip
from requests import request
from prepare_bounding_box import *
import uuid

app = flask.Flask(__name__, template_folder='template', static_folder='static')
app.secret_key = "aksjdhbakncoiu2op20109m,d"
app.permanent_session_lifetime = timedelta(minutes=5)



@app.route('/', methods=['GET', 'POST'])
def index():
    return flask.render_template('index.html')


# @return a dict with video ids and associated frame id,
# e.g.[('video_01000.mp4': 3), ('video_01000.mp4': 4), 
# ('video_00004.mp4': 25), 
# ('video_00008.mp4': 17), 
# 'video_00010.mp4': [5, 22, 38, 47, 60, 88, 96, 98, 121, 121], 
# 'video_00006.mp4': [12, 20, 29, 33, 36, 50, 67, 79, 91, 107]]
@app.route('/fetch-video')
def fetch():
    file_list = os.listdir('./static/video')
    video_id_list = []
    video_id_set = set()
    for _ in range(5):
        idx = random.randint(0, len(file_list) - 1)
        video_id = file_list[idx].strip()
        while video_id in video_id_set:
            idx = random.randint(0, len(file_list) - 1)
            video_id = file_list[idx].strip()
        # get total frames of video
        src = './static/video/' + str(video_id)
        cap = cv2.VideoCapture(src)
        frame_len = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        frame_set = set()
        for _ in range(10):
            frame_idx = random.randint(1, frame_len)
            while frame_idx in frame_set:
                frame_idx = random.randint(1, frame_len) 
            video_frame_dict = {}
            video_frame_dict['video'] = video_id
            video_frame_dict['frame'] = frame_idx
            video_id_list.append(video_frame_dict)
    random.shuffle(video_id_list)
    return app.response_class(response=json.dumps(video_id_list),
                              status=200,
                              mimetype='application/json')

# @param video_id: the video id. e.g.: 0
# @param start: time to start with e.g.: ‘01:03:05.35’.
# @param end: time to end with e.g.: ‘01:05:05.35’.
@app.route('/extract-segment/<video_id>/<start>/<end>', methods=['POST', "GET"])
def extract(video_id, start, end):
    # static/video/video_00000.mp4
    if flask.request.method == "GET":
        output = dict()
        if not flask.request.args.get('session-id'): # not contain session_id
            session_id = str(uuid.uuid1())
            flask.session.permanent = True
            src = './static/video/video_%05d.mp4' % int(video_id)
            clip = VideoFileClip(src).subclip(start, end)
            outputfile = './static/output/'+ session_id + "_" + start + '_' + end + '_video_%05d_.mp4' % int(video_id)
            clip.to_videofile(outputfile, codec="libx264", temp_audiofile='temp-audio.m4a', remove_temp=True, audio_codec='aac')
            flask.session[session_id] = outputfile
            output['session_id'] = session_id
            output['outputfile'] = [outputfile]
            return app.response_class(response=json.dumps(output),
                                                                status=200,
                                                                mimetype='application/json')
        else: 
            session_id = request.args.get('session-id')
            output['session_id'] = session_id
            output_file = []
            for f in os.listdir('./static/output'):
                if session_id in f:
                    output_file.append(f)
            output['outputfile'] = output_file
            return app.response_class(response=json.dumps(output),
                                                                statis=200,
                                                                mimetype='application/json')
    return app.response_class(response="Invalid Access method", 
                              status=404,
                              mimetype="application/json")      
            
# @param video_id: the video id. e.g.: 0
# @param frame_id: the frame id. e.g.: ‘1’.
@app.route('/box/<video_id>/<frame_id>')
def getBox(video_id, frame_id):
    box_dict = getBoxVideoFrame(video_id, frame_id)
    return app.response_class(
        response=json.dumps(str(box_dict)),
        status=200,
        mimetype='application/json'
    )
    
if __name__ == '__main__':
    app.run(debug=True)
    