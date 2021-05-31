const fs=require('fs');
const {
  createService,
  uploadVioImgService,
  getVideoCoverService,
  getVideoByIdService,
  getAllVideoService,
  getVideoDetailService,
  addPlayCountService,
  addVideoCateService,
  getVideoAllCateService,
  addCateForVioService,
  getCateVideoService,
  getCommVideoService
} = require("../service/video.service");
const {
    isExistsFile
}=require("../utils/isExists")
class VideoController{
  async create(ctx,next)
  {
    // console.log(ctx.req.files)
     const {momentId}=ctx.query;
     const {userId}=ctx.user;
     const {duration,cateId}=ctx.req.body;
     const {mimetype,filename,size}=ctx.req.file;
     const result=await createService(momentId,userId,mimetype,filename,size,duration,cateId);
     ctx.body=result;
  }  
  async uploadVioImg(ctx,next)
  {
     const {vid}=ctx.query;
     if(vid)
     {
        const {mimetype,filename,size}=ctx.req.file;
        const result=await uploadVioImgService(vid,mimetype,filename,size);
        ctx.body=result;
     }
  }
  //获取视频封面
  async getVideoCover(ctx,next)
  {
    const {vid,type}=ctx.query;
    const result=await getVideoCoverService(vid)
    let {mimetype,fileName}=result[0];
    let newFileName=fileName;
     try{
         if(type) {
             fileName = fileName + "-small";
             const result=await isExistsFile(`./upload/videoImg/${fileName}`);
             newFileName=fileName;
         }
         ctx.set('content-type',mimetype);
         ctx.body=fs.createReadStream(`./upload/videoImg/${newFileName}`);
     }catch(e){
         ctx.set('content-type',mimetype);
         ctx.body=fs.createReadStream(`./upload/videoImg/${newFileName}`);
     }

  }
  //获取视频播放
  async getVideo(ctx,next)
  {
   try{
    const {vid}=ctx.query;
    const result=await getVideoByIdService(vid);
    const {mimetype,fileName,duration}=result[0];
    ctx.set('content-type',mimetype); 
    ctx.body=fs.createReadStream(`./upload/video/${fileName}`);
   }catch(e)
   {
     console.log(e)
   }  
  }
  //获取所有视频
  async getAllVideo(ctx,next)
  {
    const {limit,offset}=ctx.query;
    const result=await getAllVideoService(limit,offset);
    ctx.body=result;
  }
  //获取视频详情
  async getVideoDetail(ctx,next)
  {
    const {vid}=ctx.query;
    const result=await getVideoDetailService(vid);
    ctx.body=result[0];  
  }
  //添加视频播放量
  async addPlayCount(ctx,next)
  {
    const {vid}=ctx.query;
    const reault=await addPlayCountService(vid);
    ctx.body=reault
  }
  //添加视频分类
  async addVideoCate(ctx,next)
  {
    const {name}=ctx.request.body;
    const result =await addVideoCateService(name);
    ctx.body=result
  }  

  //为视频添加cate
  async addCateForVio(ctx,next)
  {
    const {vid}=ctx.query;
    const {categoryId}=ctx.request.body;
    const result=await addCateForVioService(vid,categoryId)
    ctx.body=result;
  }
  //获取cate下视频
  async getCateVideo(ctx,next)
  {
    const {categoryId}=ctx.query;
    const result=await getCateVideoService(categoryId);
    ctx.body=result[0];
  }
  //获取推荐视频
  async getCommVideo(ctx,next)
  {
    const result=await getCommVideoService();
    ctx.body=result
  }
}
module.exports=new VideoController()