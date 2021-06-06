const {
    getSpcolumnTopService,
    getToplistService
}=require('../service/toplist.service')
class ToplistController{
  //专栏排行榜详情
  async getSpcolumnTop(ctx,next){
      const {cateId}=ctx.query;
      const result=await getSpcolumnTopService(cateId);
      ctx.body=result;
  }
  //获取其他榜单
    async getToplist(ctx,next){
      const {cateId}=ctx.query;
      const result=await getToplistService(cateId);
      ctx.body=result;
    }
}
module.exports=new ToplistController()