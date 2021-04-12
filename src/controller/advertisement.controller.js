const {
  createService,
  uploadImgService
}=require('../service/advertisement.service')
class AdvertisementController{
  async create(ctx,next)
  {
    const {title,url}=ctx.request.body;
    console.log(title);
    const result=await createService(title,url);
    ctx.body=result;
  }
  async uploadImg(ctx,next)
  {
    const {advertId}=ctx.query;
    const {file}=ctx.req;  
    const {userId}=ctx.user;
    const {mimetype,filename}=file;
    const result=await uploadImgService(advertId,userId,mimetype,filename)
  }
}
module.exports=new AdvertisementController();