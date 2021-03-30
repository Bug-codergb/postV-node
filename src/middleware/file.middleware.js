const Multer=require('koa-multer');

const avatarUpload=Multer({
    dest:'./upload/avatar'
})
const pictureUpload=Multer({
    dest:'./upload/picture/'
})
const videoUpload=Multer({
    dest:"./upload/video/"
})
const videoImgUpload=Multer({
    dest:"./upload/videoImg/"
})
const topicImgUpload=Multer({
    dest:'./upload/topicImg/'
})

const movieUpload=Multer({
    dest:'./upload/movie/'
})
const movieImgUpload=Multer({
    dest:"./upload/movieImg/"
})

const knowImgUpload=Multer({
    dest:'./upload/know/'
})
const knowContentUpload=Multer({
    dest:'./upload/knowContent/'
})
const avatarHandle=avatarUpload.single('avatar');
const pictureHandle=pictureUpload.array('picture');
const videoHandle=videoUpload.array('video');
//视频图片
const videoImgHandle=videoImgUpload.array('videoImg');

const topicImgHandle=topicImgUpload.array('topicImg');

//放映厅
const movieHandle=movieUpload.array('movie');
const movieImgHandle=movieImgUpload.array('movieImg');

//课程图片
const knowHandle=knowImgUpload.single('knowImg');
//课程内容
const knowContentHandle=knowContentUpload.array('knowContent');
module.exports={
    avatarHandle,
    pictureHandle,
    videoHandle,
    videoImgHandle,
    topicImgHandle,
    movieHandle,
    movieImgHandle,
    knowHandle,
    knowContentHandle
}