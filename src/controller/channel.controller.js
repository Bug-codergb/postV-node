const fs=require("fs");
const path=require("path");
const errorType=require("../constants/errorType");
const {
  CHANNEL_COVER,
  CHANNEL_VIDEO
}=require("../constants/uploadPath")
const {
  isExistsFile
}=require("../utils/isExists");
const {
  delFile
}=require("../utils/deleteFile")
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
  getCateDetailService,
  getChannelDetailService,
  getChannelUrlService,
  publishCommentService,
  getCateConDetailService,
  getChannelCommentService,
  replyCommentService,
  thumbChannelService,
  cancelThumbService,
  getChannelFileService,
  delChannelService,
  subChannelService,
  isSubService,
  cancelSubService
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
    const {id,type}=ctx.query;
    const result=await getChannelCoverService(id);
    let {fileName,mimetype,dest}=result[0];
    if(type){
      fileName=fileName+"-small";
    }
    ctx.set("content-type",mimetype);
    ctx.body=fs.createReadStream(`${dest}/${fileName}`);
  }
  //上传视频
  async uploadVideo(ctx,next){
    const {file}=ctx.req;
    const {cId}=ctx.query;
    const {dt}=ctx.req.body;
    const {originalname,mimetype,destination,filename,size}=file;
    const result=await uploadVideoService(cId,mimetype,dt,filename,destination,originalname,size);
    ctx.body=result[0];
  }
  //获取视频
  async getChannelVideo(ctx,next){
    const {id}=ctx.query;
    const result=await getChannelVideoService(id);
    console.log(result[0]);
    const {mimetype,fileName,dest,size}=result[0];
    if(size!==0){
      const range=ctx.headers.range;
      const positions=range.replace(/bytes=/,"").split("-");
      const start=parseInt(positions[0],10);
      const total=size;
      const end=positions[1]?parseInt(positions[1],10):total-1;
      const thunkSize=(end-start)+1;
      ctx.status=206;
      ctx.set("accept-ranges","bytes");
      ctx.set('content-length',thunkSize);
      ctx.set("content-range",`bytes ${start}-${end}/${total}`);
    }
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
    const {id,type}=ctx.query;
    const result=await getChannelCateCoverService(id);
    let {fileName,mimetype,dest}=result[0];
    if(type){
      fileName=fileName+"-small";
    }
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
  //获取频道内容详情
  async getChannelDetail(ctx,next){
    const {cId}=ctx.query;
    const result=await getChannelDetailService(cId);
    ctx.body=result[0];
  }
  //获取频道播放地址
  async getChannelUrl(ctx,next){
    const {cId}=ctx.query;
    const result=await getChannelUrlService(cId);
    ctx.body=result[0];
  }
  //发表频道内容评论
  async publishComment(ctx,next) {
    const {content, cId} = ctx.request.body;
    const {userId} = ctx.user;
    const result = await publishCommentService(cId, content, userId);
    ctx.body = result;
  }
  //获取子分类内容详情
  async getCateConDetail(ctx,next){
    const {id,offset,limit}=ctx.query;
    const result=await getCateConDetailService(id,offset,limit);
    let channel=[];
    const res={...result[0]};
    delete res.channel;
    if(result.length!==0){
      channel=result.map((item,index)=>{
        return item.channel;
      })
    }
    ctx.body=Object.assign(res,{channel:channel},{count:channel.length});
  }
  //获取频道内容评论
  async getChannelComment(ctx,next){
    const {id,offset,limit}=ctx.query;
    if(id){
      const result=await getChannelCommentService(id,offset,limit);
      let comment=[];
      const res={...result[0]};
      delete res.comment;
      if(result.length!==0){
        comment=result.map((item,index)=>{
          return item.comment
        })
      }
      ctx.body=Object.assign(res,{comment:comment});
    }
  }
  //回复频道内容评论
  async replyComment(ctx,next){
    const {commentId,content,cId}=ctx.request.body;
    const {userId}=ctx.user;
    const result=await replyCommentService(commentId,cId,content,userId);
    ctx.body=result[0];
  }
  //点赞频道
  async thumbChannel(ctx,next){
    const {id}=ctx.request.body;
    const {userId}=ctx.user;
    const result=await thumbChannelService(id,userId);
    ctx.body=result[0];
  }
  //取消点赞
  async cancelThumb(ctx,next){
    const {userId}=ctx.user;
    const {cId}=ctx.request.body;
    const result=await cancelThumbService(userId,cId);
    ctx.body=result;
  }
  //删除频道内容
  async delChannel(ctx,next) {
    const {id} = ctx.query;
    const result=await getChannelFileService(id);
    const {coverFile,videoFile}=result[0];
    try{
      const cover=await isExistsFile(path.resolve(__dirname,"../../",`${CHANNEL_COVER}/${coverFile}`));
      await delFile(cover);
      const video=await isExistsFile(path.resolve(__dirname,"../../",`${CHANNEL_VIDEO}/${videoFile}`));
      await delFile(video);
      const coverSmall=await isExistsFile(path.resolve(__dirname,"../../",`${CHANNEL_COVER}/${coverFile}-small`));
      await delFile(coverSmall);
    }catch(e){
      const err=new Error(errorType.THE_FILE_DOES_NOT_EXIST_AND_MAY_HAVE_BEEN_DELETED);
      return ctx.app.emit("error",err,ctx);
    }finally{
      const result=await delChannelService(id);
      ctx.body=result;
    }
  }
  //收藏频道内容
  async subChannel(ctx,next){
    const {id}=ctx.query;
    const {userId}=ctx.user;
    const isSub=await isSubService(id,userId);
    console.log(isSub)
    if(isSub.length===0){
      const result=await subChannelService(id,userId);
      ctx.body=result;
    }else{
      const err=new Error(errorType.YOU_HAVE_SUBSCRIBED);
       return ctx.app.emit("error",err,ctx);
    }
  }
  //取消收藏
  async cancelSub(ctx,next){
    const {id}=ctx.query;
    const {userId}=ctx.user;
    const result=await cancelSubService(id,userId);
    ctx.body=result;
  }
}
module.exports=new ChannelController();