const Router=require('koa-router');
const toplistRouter=new Router();
const {
  getToplistPic,
  getToplistDetail
}=require('../controller/toplist.controller');

toplistRouter.get('/toplist/picture',getToplistPic);
//获取榜单分类下详情
toplistRouter.get('/toplist/detail',getToplistDetail)
module.exports=toplistRouter;