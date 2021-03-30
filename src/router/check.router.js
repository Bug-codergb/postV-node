const Router=require('koa-router');
const checkRouter=new Router();
const {
  getAllCheck,
}=require('../controller/check.controller')
checkRouter.get('/check/moment/all',getAllCheck);

module.exports=checkRouter;