const Router=require('koa-router');
const advertRouter=new Router({prefix:'/advert'});
const {authVerify}=require('../middleware/auth.middleware');
const {advertImgHandle}=require('../middleware/file.middleware');
const {
  create,
  uploadImg,
  getAdvertImg,
  getAllAdvert
}=require('../controller/advertisement.controller');
advertRouter.post('/',authVerify,create);
advertRouter.post('/img',authVerify,advertImgHandle,uploadImg);
//获取广告封面
advertRouter.get('/img',getAdvertImg);
//获取所有广告
advertRouter.get('/all',getAllAdvert)
module.exports=advertRouter;