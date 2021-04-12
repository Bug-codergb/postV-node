const fs=require('fs');
const {
  createService,
  uploadImgService,
  getAdvertImgService,
  getAllAdvertService
}=require('../service/advertisement.service')
class AdvertisementController{
  async create(ctx,next)
  {
    const {title,url}=ctx.request.body;
    //console.log(title);
    const result=await createService(title,url);
    ctx.body=result;
  }
  async uploadImg(ctx,next)
  {
    const {advertId}=ctx.query;
    const {file}=ctx.req;  
    const {userId}=ctx.user;
    const {mimetype,filename}=file;
    const result=await uploadImgService(advertId,userId,mimetype,filename);
    ctx.body=result;
  }
  //获取广告封面
  async getAdvertImg(ctx,next)
  {
    const {id}=ctx.query;
    const result=await getAdvertImgService(id);
    const {mimetype,fileName}=result[0];
    ctx.set('content-type',mimetype);
    ctx.body=fs.createReadStream(`./upload/advert/${fileName}`)
  }
  //获取所有广告
  async getAllAdvert(ctx,next)
  {
    try{
      const {offset,limit}=ctx.query;
      const result=await getAllAdvertService(offset,limit);
      ctx.body=result;
    }catch(e)
    {
      console.log(e)
    }
  }
}
module.exports=new AdvertisementController();