const Router=require("koa-router");
const channelRouter=new Router({prefix:"/channel"});
const {channelCoverHandle}=require("../middleware/file.middleware")
const {
  create,
  uploadCover,
  addChannel,
  getAllCate
}=require("../controller/channel.controller");
const {authVerify}=require("../middleware/auth.middleware")
//上传内容
channelRouter.post("/",authVerify,addChannel)
//添加分类
channelRouter.post("/cate",authVerify,create);
//获取所有分类
channelRouter.get("/cate/all",getAllCate);
//上传封面
channelRouter.post("/upload/cover",authVerify,channelCoverHandle,uploadCover)
module.exports=channelRouter