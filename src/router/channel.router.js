const Router=require("koa-router");
const channelRouter=new Router({prefix:"/channel"});
const {channelCoverHandle,channelVideoHandle,channelCateCoverHandle,reSizePic}=require("../middleware/file.middleware")
const {
  create,
  uploadCover,
  addChannel,
  getAllCate,
  getChannelCover,
  uploadVideo,
  getChannelVideo,
  addCateCon,
  addChannelCateCover,
  getChannelCateCover,
  getChannelCateCon,
  getCateDetail,
  getChannelDetail,
  getChannelUrl,
  publishComment,
  getCateConDetail,
  getChannelComment,
  replyComment,
  thumbChannel,
  cancelThumb,
  delChannel
}=require("../controller/channel.controller");
const {authVerify}=require("../middleware/auth.middleware");
const {
  delChanelAuth
}=require("../middleware/channel.middleware");
//上传内容
channelRouter.post("/",authVerify,addChannel)
//添加分类
channelRouter.post("/cate",authVerify,create);

//添加分类内容
channelRouter.post("/cate/con",authVerify,addCateCon);
//分类内容图片
channelRouter.post("/cate/con/cover",authVerify,channelCateCoverHandle,reSizePic,addChannelCateCover);
//获取分类内容图片
channelRouter.get("/cate/con/cover",getChannelCateCover);


//获取所有分类
channelRouter.get("/cate/all",getAllCate);
//上传封面
channelRouter.post("/upload/cover",authVerify,channelCoverHandle,reSizePic,uploadCover);
//获取图片封面
channelRouter.get("/cover",getChannelCover);

//上传视频
channelRouter.post("/video",authVerify,channelVideoHandle,uploadVideo);
//获取视频
channelRouter.get("/video",getChannelVideo);
//获取子分类
channelRouter.get("/cate/con",getChannelCateCon)
//获取曲分类下（体育，音乐）内容
channelRouter.get("/cate/detail",getCateDetail);
//获取频道内容详情
channelRouter.get("/content/detail",getChannelDetail);
//获取频道播放地址
channelRouter.get("/url",getChannelUrl);
//发表频道内容评论
channelRouter.post("/comment",authVerify,publishComment);
//获取子分类内容详情
channelRouter.get("/cate/con/detail",getCateConDetail);
//获取频道内容评论
channelRouter.get("/comment",getChannelComment);
//回复评论
channelRouter.post("/comment/reply",authVerify,replyComment);
//点赞频道
channelRouter.post("/thumb",authVerify,thumbChannel);
//取消点赞频道
channelRouter.post("/thumb/cancel",authVerify,cancelThumb);
//删除频道
channelRouter.post("/delete",authVerify,delChanelAuth,delChannel)
module.exports=channelRouter  