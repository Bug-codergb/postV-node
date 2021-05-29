const Multer=require('koa-multer');
const Jimp=require('jimp');
const path=require('path');

const avatarUpload=Multer({
    dest:'./upload/avatar'
})
const pictureUpload=Multer({
    dest:'./upload/picture/'
})
//评论内容图片
const commentImgUpload=Multer({
  dest:"./upload/comment"
})

const videoUpload=Multer({
    dest:"./upload/video/"
})
const videoImgUpload=Multer({
    dest:"./upload/videoImg/"
})
//话题内容图片
const topicImgUpload=Multer({
    dest:'./upload/topicContentImg/'
})
//话题封面
const topicCoverUpload=Multer({
    dest:'./upload/topicImg'
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
//广告封面
const advertUpload=Multer({
    dest:'./upload/advert/'
})
//专栏封面
const channelCoverUpload=Multer({
    dest:"./upload/channel/channelCover"
})
//频道视频
const channelVideo=Multer({
    dest:"./upload/channel/channelVideo"
})
//频道内容分类图片
const channelCateCover=Multer({
    dest:"./upload/channel/channelCateCover"
})

const avatarHandle=avatarUpload.single('avatar');
const pictureHandle=pictureUpload.single('picture');
const videoHandle=videoUpload.single('video');
//视频图片
const videoImgHandle=videoImgUpload.single('videoImg');

const topicImgHandle=topicImgUpload.array('topicImg');

//放映厅
const movieHandle=movieUpload.array('movie');
const movieImgHandle=movieImgUpload.array('movieImg');

//课程图片
const knowHandle=knowImgUpload.single('knowImg');
//课程内容
const knowContentHandle=knowContentUpload.array('knowContent');

//话题封面
const topicCoverHandle=topicCoverUpload.single('topicCover');
//广告
const advertImgHandle=advertUpload.single('advertImg');

//专栏封面
const channelCoverHandle=channelCoverUpload.single("cover");
//视频
const channelVideoHandle=channelVideo.single("channel_video");
//频道内容分类图片
const channelCateCoverHandle=channelCateCover.single("channel_cate_cover");

//评论内容图片
const commentImgHandle=commentImgUpload.single("comment_picture");

async function reSizePic(ctx,next)
{
    const file=ctx.req.file;
    const destPath=path.join(file.destination,file.filename);
    Jimp.read(file.path).then(image=>{
        image.resize(400,Jimp.AUTO).write(`${destPath}-small`);
    })
    await next();
}

module.exports={
    reSizePic,
    avatarHandle,
    pictureHandle,
    videoHandle,
    videoImgHandle,
    topicImgHandle,
    movieHandle,
    movieImgHandle,
    knowHandle,
    knowContentHandle,
    topicCoverHandle,
    advertImgHandle,
    channelCoverHandle,
    channelVideoHandle,
    channelCateCoverHandle,
    commentImgHandle
}