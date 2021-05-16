const {
  createService,
  uploadCoverService,
  addChannelService,
  getAllCateService
}=require("../service/channel.service.js")
class ChannelController{
  async create(ctx,next){
    try{
      const {name}=ctx.request.body;
    const result=await createService(name);
    ctx.body=result;
    }catch(e){
      console.log(e);
    }
  }
  //获取所有分类
  async getAllCate(ctx,next){
    const result =await getAllCateService();
    ctx.body=result;
  }
  //添加channel内容
  async addChannel(ctx,next){
    const {userId}=ctx.user;
    const {cateId,title,content}=ctx.request.body;
    const result=await addChannelService(title,content,userId,cateId);
    ctx.body=result;
  }  
  //上传封面
  async uploadCover(ctx,next){
    const {file}=ctx.req;
    const {cId}=ctx.query;
    console.log(file);
    const {mimetype,destination,filename,size,originalname}=file;
    const result=await uploadCoverService(cId,mimetype,destination,filename,size,originalname); 
    ctx.body=result;
  }
}
module.exports=new ChannelController();