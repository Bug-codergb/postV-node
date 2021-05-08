const Router=require('koa-router');
const toplistRouter=new Router();

const {
  getToplistPic,
  getToplistVio,
  getToplistArticle
}=require('../controller/toplist.controller');
//图片榜单
toplistRouter.get('/toplist/picture',getToplistPic);
//获取视频榜单
toplistRouter.get('/toplist/video',getToplistVio)
//文章榜单
toplistRouter.get('/toplist/article',getToplistArticle)
module.exports=toplistRouter;  