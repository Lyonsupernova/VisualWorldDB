
export const VIDEO_FILE_DIRECTORY = './static/video/dataset_1/'

// List of supported data set names  
export const DATASET_OPTIONS = ['dataset_1']


// List of supported data set names  
export const DATASET_TO_VIDEO_NAME = new Map()
DATASET_TO_VIDEO_NAME.set('dataset_1',['video_00000.mp4', 'video_00001.mp4', 'video_00002.mp4', 'video_00003.mp4', 'video_00004.mp4', 'video_00005.mp4', 'video_00006.mp4', 'video_00007.mp4', 'video_00008.mp4', 'video_00009.mp4', 'video_00010.mp4'])

// Mapping video name to video ID, since our backend API use ID to identify video.  
export const VIDEONAME_TO_ID = new Map([['video_00000.mp4', 0], 
					['video_00001.mp4', 1], 
					['video_00002.mp4', 2], 
					['video_00003.mp4', 3], 
					['video_00004.mp4', 4], 
					['video_00005.mp4', 5], 
					['video_00006.mp4', 6], 
					['video_00007.mp4', 7], 
					['video_00008.mp4', 8], 
					['video_00009.mp4', 9], 
					['video_00010.mp4', 10]])

export const toTime = (frames, video) =>  {
	var time = (typeof frames !== 'number' ? video.currentTime : frames), frameRate = 24;
	var dt = (new Date()), format = 'hh:mm:ss' + (typeof frames === 'number' ? ':ff' : '');
	dt.setHours(0); dt.setMinutes(0); dt.setSeconds(0); dt.setMilliseconds(time * 1000);
	function wrap(n) { return ((n < 10) ? '0' + n : n); }
	return format.replace(/hh|mm|ss|ff/g, function(format) {
		switch (format) {
			case "hh": return wrap(dt.getHours() < 13 ? dt.getHours() : (dt.getHours() - 12));
			case "mm": return wrap(dt.getMinutes());
			case "ss": return wrap(dt.getSeconds());
			case "ff": return wrap(Math.floor(((time % 1) * frameRate)));
		}
	});
};