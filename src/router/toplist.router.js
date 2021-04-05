const Router=require('koa-router');
const toplistRouter=new Router();

const {
  getToplistPic,
  getToplistVio
}=require('../controller/toplist.controller');

toplistRouter.get('/toplist/picture',getToplistPic);
//获取视频榜单
toplistRouter.get('/toplist/video',getToplistVio)
module.exports=toplistRouter;