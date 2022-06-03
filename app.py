
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

# return a list of video name of provided dataset
# fetch("/fetch-dataset/dataset_1")
# return format: ["video_00008.mp4", "video_00009.mp4", "video_00010.mp4", "video_00004.mp4", "video_00005.mp4", "video_00007.mp4", "video_00006.mp4", "video_00002.mp4", "video_00003.mp4", "video_00001.mp4", "video_00000.mp4"]
@app.route('/fetch-dataset/<dataset_id>')
def videoFetchHandler(dataset_id):
    file_path = './static/video/{}'.format(dataset_id)
    if not os.path.exists(file_path):
        return app.response_class(response="Invalid File Path", 
                              status=404,
                              mimetype="application/json")    
    file_list = os.listdir(file_path)
    return app.response_class(response=json.dumps(file_list), 
                              status=200,
                              mimetype="application/json")    
    
# @return a dict with video ids and associated frame id,
# e.g.
# fetch("/fetch-video/dataset_1/video_00000.mp4")
# return format: {"dataset_id": "dataset_1", "video_id": "video_00010.mp4", "frame_id": [17, 39, 60, 61, 74, 89, 92, 101, 119, 123]}
@app.route('/fetch-video/<dataset_id>/<video_id>')
def frameFetchHandler(dataset_id, video_id):
    file_path = './static/video/{}/{}'.format(dataset_id, video_id)
    if not os.path.exists(file_path):
        return app.response_class(response="Invalid File Path", 
                                  status=404,
                                  mimetype="application/json")
    cap = cv2.VideoCapture(file_path)
    frame_len = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_set = set()
    while len(frame_set) < 10:
        frame_idx = random.randint(1, frame_len)
        frame_set.add(frame_idx)
    # random.shuffle(video_id_list)
    res = dict()
    res["dataset_id"] = dataset_id
    res["video_id"] = video_id
    frame_list = list(frame_set)
    frame_list.sort()
    res["frame_id"] = frame_list
    return app.response_class(response=json.dumps(res),
                              status=200,
                              mimetype='application/json')

# @param video_id: the video id. e.g.: 0
# @param start: time to start with e.g.: ‘01:03:05.35’.
# @param end: time to end with e.g.: ‘01:05:05.35’.
@app.route('/extract-segment/<dataset_id>/<video_id>/<start>/<end>', methods=['POST', "GET"])
def segmentExtractHandler(dataset_id, video_id, start, end):
    # static/video/video_00000.mp4
    if flask.request.method == "GET":
        output = dict()
        if not flask.request.args.get('session-id'): # not contain session_id
            session_id = str(uuid.uuid1())
            flask.session.permanent = True
            src = './static/video/{}/{}'.format(dataset_id, video_id)
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
@app.route('/box/<dataset_id>/<video_id>/<frame_id>')
def boxFetchHandler(dataset_id, video_id, frame_id):
    box_dict = getBoxVideoFrame(dataset_id, video_id, frame_id)
    return app.response_class(
        response=json.dumps(str(box_dict)),
        status=200,
        mimetype='application/json'
    )
    
if __name__ == '__main__':
    app.run(debug=True)
    