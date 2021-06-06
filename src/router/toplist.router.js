const Router=require('koa-router');
const toplistRouter=new Router({prefix:"/toplist"});
const {
    getSpcolumnTop,
    getToplist
}=require('../controller/toplist.controller');
//专栏排行榜详情
toplistRouter.get("/spcolumn",getSpcolumnTop);
//获取音乐，军事等榜单
toplistRouter.get("/",getToplist)
module.exports=toplistRouter;