const {
  getToplistPicService,
  getToplistDetailService
}=require('../service/toplist.service')
class ToplistController{
  async getToplistPic(ctx,next)
  {
    const {offset,limit}=ctx.query;
    const result=await getToplistPicService(offset,limit);
    ctx.body=result;
  }
  //获取榜单分类下详情
  async getToplistDetail(ctx,next)
  {
    const {categoryId}=ctx.query;
    const result=await getToplistDetailService(categoryId);
    ctx.body=result;
  }
}
module.exports=new ToplistController()