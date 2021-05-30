const Router=require("koa-router");
const spcolumnRouter=new Router({prefix:"/spcolumn"});
const {
    authVerify
}=require("../middleware/auth.middleware");
const {
    create,
    getSpcolumnCate,
    setMomentSpcolumn,
    getSpcolumnDetail
}=require("../controller/spcolumn.controller")
//添加分类
spcolumnRouter.post("/",authVerify,create);
//获取分类
spcolumnRouter.get("/",getSpcolumnCate);
//为动态划分专栏
spcolumnRouter.post("/moment",authVerify,setMomentSpcolumn);
//获取专栏下分类内容
spcolumnRouter.get("/cate/detail",getSpcolumnDetail)
module.exports=spcolumnRouter;
