import os
import numpy as np
import json
import argparse
from pprint import pprint
import pycocotools._mask as _mask
import cv2
from torchvision.ops import masks_to_boxes
import torch


def decode(rleObjs):
    if type(rleObjs) == list:
        return _mask.decode(rleObjs)
    else:
        return _mask.decode([rleObjs])[:,:,0]


# pprint(data)

def getBoxVideoFrame(dataset_id, video_id, frame_id):
    with open(os.path.join('./static/sim/', 'sim_%05d.json' % int(video_id))) as f:
        data = json.load(f)
    print(data['video_name'])
    frame = data['frames'][int(frame_id)]
    print('frame_name', frame['frame_filename'])
    print('frame_index', frame['frame_index'])
    objects = frame['objects']
    print(len(objects))
    print("filepath: " + "./static/video/{}/video_{}.mp4".format(dataset_id, str(video_id).zfill(5)))
    cap = cv2.VideoCapture("./static/video/{}/video_{}.mp4".format(dataset_id, str(video_id).zfill(5)))
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(frame_id))
    ret, image = cap.read()
    box_list = []
    for i in range(len(objects)):
        box_dict = dict()
        print(objects[i]['material'], objects[i]['color'], objects[i]['shape'])
        mask = decode(objects[i]['mask'])
        # O represents black, 1 represents white.
        # print(np.sum(mask))
        box = masks_to_boxes(torch.from_numpy(mask[np.newaxis, :]))
        box = np.squeeze(box.numpy(), axis=0)
        res = cv2.rectangle(image, (int(box[0]), int(box[1])), (int(box[2]), int(box[3])), (0,255,0), 1)
        print(box)
        cv2.imwrite('./static/mask/mask_%d.png' % i, res)
        print(box_dict)
        box_dict['material'] = objects[i]['material']
        box_dict['color'] = objects[i]['color']
        box_dict['shape'] = objects[i]['shape']
        box_dict['lt'] = [box[0], box[1]]
        box_dict['rb'] = [box[2], box[3]]
        box_list.append(box_dict)
    return box_list

