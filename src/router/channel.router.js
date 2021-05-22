const Router=require("koa-router");
const channelRouter=new Router({prefix:"/channel"});
const {channelCoverHandle,channelVideoHandle,channelCateCoverHandle}=require("../middleware/file.middleware")
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
  getChannelCateCover
}=require("../controller/channel.controller");
const {authVerify}=require("../middleware/auth.middleware")
//上传内容
channelRouter.post("/",authVerify,addChannel)
//添加分类
channelRouter.post("/cate",authVerify,create);

//添加分类内容
channelRouter.post("/cate/con",authVerify,addCateCon);
//分类内容图片
channelRouter.post("/cate/con/cover",authVerify,channelCateCoverHandle,addChannelCateCover);
//获取分类内容图片
channelRouter.get("/cate/con/cover",getChannelCateCover);


//获取所有分类
channelRouter.get("/cate/all",getAllCate);
//上传封面
channelRouter.post("/upload/cover",authVerify,channelCoverHandle,uploadCover);
//获取图片封面
channelRouter.get("/cover",getChannelCover);
//上传视频
channelRouter.post("/video",authVerify,channelVideoHandle,uploadVideo);
//获取视频
channelRouter.get("/video",getChannelVideo)  
module.exports=channelRouter  