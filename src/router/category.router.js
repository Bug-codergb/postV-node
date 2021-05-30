const Router=require('koa-router');
const cateRouter=new Router({prefix:'/cate'});
const {
  create,
  getAllCate,
  getCateDetail,
  addCateCon
}=require('../controller/category.controller');
const {
  authVerify
}=require("../middleware/auth.middleware")
cateRouter.post('/',create);
cateRouter.get('/all',getAllCate)
//获取分类下内容
//cateRouter.get('/detail',getCateDetail);
//添加分类子分类
cateRouter.post("/con",authVerify,addCateCon)
module.exports=cateRouter;    