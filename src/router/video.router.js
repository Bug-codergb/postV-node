const Router=require('koa-router');
const videoRouter=new Router({prefix:'/video'});
const {
  create,
  uploadVioImg,
  getVideoCover,
  getVideo,
  getAllVideo,
  getVideoDetail,
  addPlayCount,
  addVideoCate,
  getVideoAllCate,
  addCateForVio,
  getCateVideo,
  getCommVideo
}=require('../controller/video.controller');
const {
  videoHandle,
  videoImgHandle,
    reSizePic
}=require('../middleware/file.middleware');
const {
  authVerify
}=require('../middleware/auth.middleware')
//上传视频
videoRouter.post('/upload',authVerify,videoHandle,create);
//上传视频图片
videoRouter.post('/img',authVerify,videoImgHandle,reSizePic,uploadVioImg)
//获取视频封面
videoRouter.get('/cover',getVideoCover)
//获取视频播放(浏览器)
videoRouter.get('/',getVideo)
//获取所有视频
videoRouter.get('/all',getAllVideo)
//获取视频详情
videoRouter.get('/detail',getVideoDetail)
//增加播放量
videoRouter.post('/add/playCount',addPlayCount)
//添加视频分类
videoRouter.post('/cate/add',authVerify,addVideoCate)

//为视频添加cate
videoRouter.post('/cate',authVerify,addCateForVio)
//获取cate下视频
videoRouter.get('/cate',getCateVideo);
//获取推荐视频
videoRouter.get('/commend',getCommVideo)
module.exports=videoRouter;