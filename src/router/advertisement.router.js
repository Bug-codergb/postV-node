const Router=require('koa-router');
const advertRouter=new Router({prefix:'/advert'});
const {authVerify}=require('../middleware/auth.middleware');
const {advertImgHandle}=require('../middleware/file.middleware');
const {
  create,
  uploadImg
}=require('../controller/advertisement.controller');
advertRouter.post('/',authVerify,create);
advertRouter.post('/img',authVerify,advertImgHandle,uploadImg);
module.exports=advertRouter;