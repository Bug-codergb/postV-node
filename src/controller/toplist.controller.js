const {
  getToplistPicService
}=require('../service/toplist.service')
class ToplistController{
  async getToplistPic(ctx,next)
  {
    const {offset,limit}=ctx.query;
    const result=await getToplistPicService(offset,limit);
    ctx.body=result;
  }
}
module.exports=new ToplistController()