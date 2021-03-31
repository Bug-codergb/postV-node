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
  getCateVideoService
} = require("../service/video.service");
class VideoController{
  async create(ctx,next)
  {
    // console.log(ctx.req.files)
     const {momentId}=ctx.query;
     const {userId}=ctx.user;
     const {duration}=ctx.req.body;
     let vids=[];
     for(let index in ctx.req.files)
     {
      const {mimetype,filename,size}=ctx.req.files[index];
      const result=await createService(momentId,userId,mimetype,filename,size,duration[index]);
      vids.push(result);
     }
     ctx.body=vids;
  }  
  async uploadVioImg(ctx,next)  
  {  
     //console.log(ctx.req.files);
     const vids=JSON.parse(ctx.query.vids);
     if(vids)
     {
      for(let index in ctx.req.files)
      {
        const {mimetype,filename,size}=ctx.req.files[index];
        const result=await uploadVioImgService(vids[index],mimetype,filename,size);
        ctx.body=result;
      }
     }
  }
  //获取视频封面
  async getVideoCover(ctx,next)
  {
    const {vid}=ctx.query;
    const result=await getVideoCoverService(vid)
    const {mimetype,fileName}=result[0];
    ctx.response.set('content-type',mimetype);
    ctx.response.body=fs.createReadStream(`./upload/videoImg/${fileName}`);
  }
  //获取视频播放
  async getVideo(ctx,next)
  {
    const {vid}=ctx.query;
    const result=await getVideoByIdService(vid);
    const {mimetype,fileName}=result[0];
    ctx.set('content-type',mimetype);
    ctx.set("Accept-Ranges", "bytes");
    ctx.body=fs.createReadStream(`./upload/video/${fileName}`);
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
  //获取视频分类
  async getVideoAllCate(ctx,next)
  {
    const result=await getVideoAllCateService();
    ctx.body=result;
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
}
module.exports=new VideoController()