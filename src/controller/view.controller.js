const {
  createService,
  getmomentByUserIdService
}=require('../service/view.service')
class ViewController{
  async create(ctx,next)
  {
    const {userId}=ctx.user;
    const {momentId}=ctx.query;
    if(momentId)
    {
      const res=await getmomentByUserIdService(userId,momentId);
      if(res.length!==0)
      {
        ctx.body={status:200}
        return ;
      }
      else{
        const result=await createService(userId,momentId)
        ctx.body=result;
      }
    }
  }
}
module.exports=new ViewController()