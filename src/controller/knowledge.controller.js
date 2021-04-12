const fs=require('fs')
const {
  createService,
  setKnowImgService,
  getImgByKonwService,
  uploadKonwService,
  getKnowContentService,
  getAllKnowService,
  getKnowDetailService,
  getKnowUrlService
}=require('../service/knowledge.service')
class KnowledgeController{
  async create(ctx,next)
  {
    const {title,vip,description}=ctx.request.body;
    const {userId}=ctx.user;
    const result=await createService(title,userId,vip,description);
    ctx.body=result;
  }
  //为课程配图
  async setKnowImg(ctx,next)    
  {
    const {kid}=ctx.query;
    const {mimetype,filename,size}=ctx.req.file;
    const result=await setKnowImgService(kid,mimetype,filename,size);
    ctx.body=result;  
  }
  //获取课程图片
  async getKnowImg(ctx,next)  
  {
    const {id}=ctx.query;
    const result=await getImgByKonwService(id); 
    const {mimetype,fileName}=result[0];
    ctx.set('content-type',mimetype);
    ctx.body=fs.createReadStream(`./upload/know/${fileName}`);
  }
  //上传课程
  async uploadKonw(ctx,next)
  {
    const {kid}=ctx.query;
    const files=ctx.req.files;
    const {title}=ctx.req.body;
    //console.log(title)
    for(let file of files)
    {
      const {filename,size,mimetype}=file;
      const result=await uploadKonwService(kid,title,filename,size,mimetype)
      ctx.body=result;
    }
  }
  //获取课程内容
  async getKnowContent(ctx,next)    
  {
    const {id}=ctx.query;
    const result=await getKnowContentService(id);
    const {mimetype,fileName}=result[0];
    ctx.set('content-type',mimetype);
    ctx.body=fs.createReadStream(`./upload/knowContent/${fileName}`)
  }
  //获取所有课程
  async getAllKnow(ctx,next)
  {
    const {offset,limit}=ctx.query;
    console.log(offset,limit)
    const result=await getAllKnowService(offset,limit);
    ctx.body=result;
  }
  //获取课程下内容
  async getKnowDetail(ctx,next)
  {
    const {kid}=ctx.query;
    const result=await getKnowDetailService(kid);
    ctx.body=result[0];
  }
  //获取课程播放地址
  async getKnowUrl(ctx,next)
  {
    const {id}=ctx.query;
    const result=await getKnowUrlService(id);
    ctx.body=result[0];
  }
}
module.exports=new KnowledgeController()