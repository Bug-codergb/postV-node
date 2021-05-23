const fs=require("fs");
const {
  createService,
  uploadCoverService,
  addChannelService,
  getAllCateService,
  getChannelCoverService,
  uploadVideoService,
  getChannelVideoService,
  addCateConService,
  addChannelCateCoverService,
  getChannelCateCoverService,
  getChannelCateConService,
  getCateDetailService
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
  //添加分类内容
  async addCateCon(ctx,next){
    const {cateId}=ctx.query;
    const {name}=ctx.request.body;
    const result=await addCateConService(cateId,name);
    ctx.body=result;
  }
  //添加channel内容
  async addChannel(ctx,next){
    const {userId}=ctx.user;
    const {cateId,title,content}=ctx.request.body;
    const result=await addChannelService(title,content,userId,cateId);
    ctx.body={
      id:result
    };
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
  //获取封面图片
  async getChannelCover(ctx,next){
    const {id}=ctx.query;
    const result=await getChannelCoverService(id);
    const {fileName,mimetype,dest}=result[0];
    ctx.set("content-type",mimetype);
    ctx.body=fs.createReadStream(`${dest}/${fileName}`);
  }
  //上传视频
  async uploadVideo(ctx,next){
    const {file}=ctx.req;
    const {cId}=ctx.query;
    const {dt}=ctx.req.body;
    const {originalname,mimetype,destination,filename}=file;
    const result=await uploadVideoService(cId,mimetype,dt,filename,destination,originalname);
    ctx.body=result[0];
  }
  //获取视频
  async getChannelVideo(ctx,next){
    const {id}=ctx.query;
    const result=await getChannelVideoService(id);
    const {mimetype,fileName,dest}=result[0];
    ctx.set("content-type",mimetype);
    ctx.body=fs.createReadStream(`${dest}/${fileName}`);
  }
  //添加分类内容图片
  async addChannelCateCover(ctx,next){
    const {id}=ctx.query;
    const {file}=ctx.req;
    const {filename,mimetype,destination,originalname}=file;
    const result=await addChannelCateCoverService(id,filename,mimetype,destination,originalname);
    ctx.body=result;
  }
  //获取分类内容图片  
  async getChannelCateCover(ctx,next){
    const {id}=ctx.query;
    const result=await getChannelCateCoverService(id);
    const {fileName,mimetype,dest}=result[0];
    ctx.set("content-type",mimetype);
    ctx.body=fs.createReadStream(`${dest}/${fileName}`);
  }
  //获取子分类
  async getChannelCateCon(ctx,next){
    const {id}=ctx.query;
    const result=await getChannelCateConService(id);
    ctx.body=result;
  }
  //获取分类下（体育，搞笑）内容
  async getCateDetail(ctx,next){
    const {offset,limit,cateId}=ctx.query;
    const result=await getCateDetailService(cateId,offset,limit);
    ctx.body=result;
  }
}
module.exports=new ChannelController();