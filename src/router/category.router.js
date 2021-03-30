const Router=require('koa-router');
const cateRouter=new Router({prefix:'/cate'});
const {
  create,
  getAllCate,
  getCateDetail
}=require('../controller/category.controller');
cateRouter.post('/',create);
cateRouter.get('/all',getAllCate)
//获取分类下内容
cateRouter.get('/detail',getCateDetail)
module.exports=cateRouter;  