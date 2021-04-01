const Router=require('koa-router');
const toplistRouter=new Router();

const {
  getToplistPic
}=require('../controller/toplist.controller');

toplistRouter.get('/toplist/picture',getToplistPic);

module.exports=toplistRouter;