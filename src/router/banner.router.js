const Router=require('koa-router');
const bannerRouter=new Router({prefix:'/banner'});
const {
  getNewBanner,
  getHotBanner
}=require('../controller/banner.controller')
bannerRouter.get('/new',getNewBanner);
//热门banner
bannerRouter.get('/hot',getHotBanner)
module.exports=bannerRouter    