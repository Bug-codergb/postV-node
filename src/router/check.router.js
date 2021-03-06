const Router=require('koa-router');
const checkRouter=new Router();
const {
  getAllCheck,
  checkMoment,
  getAllCheckVio
}=require('../controller/check.controller');
const {authVerify}=require('../middleware/auth.middleware')
checkRouter.get('/check/moment/all',getAllCheck);
//审核通过
checkRouter.post('/check/moment',authVerify,checkMoment)
//获取所有check视频
checkRouter.get("/check/video",getAllCheckVio)
module.exports=checkRouter;