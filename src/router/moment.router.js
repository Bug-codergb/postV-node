const Router=require('koa-router');
const momentRouter=new Router({prefix:'/moment'});
const {authVerify,updateVerify}=require('../middleware/auth.middleware');
const {
    create,
    getMomentById,
    getAllMoment,
    delMoment,
    getRecMoment,
    getHotMoment,
    subMoment,
    cancelSub,
    getDetailCount
}=require('../controller/moment.controller');
//发布动态
momentRouter.post('/add',authVerify,create);
momentRouter.get('/',getMomentById);
momentRouter.get('/all',getAllMoment);
momentRouter.post('/delete',authVerify,updateVerify,delMoment);
//获取推荐动态
momentRouter.get('/recommend',getRecMoment)
//获取热门动态
//momentRouter.get('/hot',getHotMoment)

//获取热门动态 
momentRouter.get('/hot',getHotMoment)

//收藏动态
momentRouter.post('/sub',authVerify,subMoment)
//取消收藏
momentRouter.post('/cancel',authVerify,cancelSub)
//获取动态的点赞数，收藏数，评论数
momentRouter.get('/detail/count',getDetailCount);
module.exports=momentRouter;