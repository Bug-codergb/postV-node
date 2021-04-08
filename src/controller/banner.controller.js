const {
  getNewBannerService,
  getHotBannerService
}=require('../service/banner.service')
class BannerController{
  async getNewBanner(ctx,next)
  {
    const result=await getNewBannerService();
    ctx.body=result 
  }
  //获取hotbanner
  async getHotBanner(ctx,next)
  {
    const result=await getHotBannerService();
    ctx.body=result;
  }
}
module.exports=new BannerController();  