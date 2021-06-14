const fs = require('fs');
const path=require("path");
const errorType=require("../constants/errorType")
const {
  isExistsFile
}=require("../utils/isExists");
const {
  delFile
}=require("../utils/deleteFile")
const {
  getSizePic
}=require("../utils/getSizePic");
const uploadPath=require("../constants/uploadPath");
const {
  createService,
  getAllTopicService,
  delTopicService,
  addContentService,
  addContentImgService,
  getTopicImgService,
  getTopicContentService,
  delTopicContentService,
  setTopicImgService,
  getTopicCoverService,
  setTopicCommentService,
  getContentIdByComentId,
  replyComentService,
  subTopicContentService,
  isSubService,
  getTopicContentDetailService,
  joinTopicService,
  getTopicMemberService,
  getRecTopicService,
  getTopicCoverFileService,
  getTopicContentFileService
} = require('../service/topic.service')
class TopicController {
  async create(ctx, next) {
    const { name,desc} = ctx.request.body;
    const {userId}=ctx.user;
    const result = await createService(name,desc,userId);
    ctx.body = result;
  }
  async getAllTopic(ctx, next) {
    const { offset, limit } = ctx.query;
    const result = await getAllTopicService(offset, limit);
    ctx.body = result;
  }
  //为话题配图
  async setTopicImg(ctx, next) {
    const { userId } = ctx.user;
    const { topicId } = ctx.query;  
    const { file } = ctx.req;
    const { mimetype, filename, size } = file;
    const result = await setTopicImgService(userId, topicId, mimetype, filename, size);
    ctx.body = result;
  }
  //获取话题封面
  async getTopicCover(ctx, next) {  
    const { id,type } = ctx.query;
    const result = await getTopicCoverService(id);
    let { fileName, mimetype } = result[0];
    let newFileName=fileName;
    try{
      if(type){
        fileName=fileName+"-small";
        await isExistsFile(`./upload/topicImg/${fileName}`);
        newFileName=fileName;
      }
      ctx.set('content-type', mimetype);
      ctx.body = fs.createReadStream(`./upload/topicImg/${newFileName}`)
    }catch(e){
      ctx.set('content-type', mimetype);
      ctx.body = fs.createReadStream(`./upload/topicImg/${newFileName}`)
    }
  }
  //删除话题
  async delTopic(ctx, next) {
    const { topicId } = ctx.query;
    const cover=await getTopicCoverFileService(topicId);
    const {mimetype,fileName,size}=cover[0];
    const filePath=path.resolve(uploadPath.TOPIC_COVER,fileName);
    //console.log(filePath);
    try{
      const topicCover=await isExistsFile(filePath);
      await delFile(topicCover);
      const topicCoverSmall=await isExistsFile(`${filePath}-small`);
      await delFile(topicCoverSmall);
    }catch(e){
      const err=new Error(errorType.THE_FILE_DOES_NOT_EXIST_AND_MAY_HAVE_BEEN_DELETED);
      return ctx.app.emit("error",err,ctx);
    }finally {
      const result = await delTopicService(topicId);
      ctx.body = result[0];
    }
  }
  //为话题添加内容
  async addContent(ctx, next) {
    let { topic_content_id,title, content } = ctx.request.body;
    const { topicId } = ctx.query;
    const {userId}=ctx.user
    const result = await addContentService(topic_content_id,topicId, title, content,userId);
    ctx.body = result;
  }
  async addContentImg(ctx, next) {
    const { topic_content_id } =ctx.query;
    const { file } = ctx.req;
    const { userId } = ctx.user;
    const { mimetype, filename, size, originalname } = file;
    const result = await addContentImgService(topic_content_id, userId, mimetype, filename, originalname, size);
    ctx.body = {
      errno:0,
      data:[result],
    };
  }
  //获取话题图片
  async getTopicImg(ctx, next) {
    const { id,type } = ctx.query;
    const result = await getTopicImgService(id);
    let { fileName, mimetype } = result[0];
    const newFileName=await getSizePic(type,fileName,`./upload/topicContentImg`);
    ctx.set('content-type', mimetype);
    ctx.body=fs.createReadStream(`./upload/topicContentImg/${newFileName}`);
  }
  //获取话题内容
  async getTopicContent(ctx, next) {
    try {
      const { offset, limit, topicId } = ctx.query;
      const result = await getTopicContentService(topicId, offset, limit);
      ctx.body = result[0];
    } catch (e) {
      console.log(e)
    }
  }
  //删除话题下内容
  async delTopicContent(ctx, next) {
    const { id } = ctx.query;
    const result=await getTopicContentFileService(id);
    try{
      for(let item of result){
        const data=await isExistsFile(path.resolve(uploadPath.TOPIC_CONTENT_IMG,item.fileName));
        if(data){
          await delFile(data);
        }
        const smallData=await isExistsFile(path.resolve(uploadPath.TOPIC_CONTENT_IMG,`${item.fileName}-small`));
        await delFile(smallData);
      }
    }catch(e){
      console.log(e)
      const err=new Error(errorType.THE_FILE_DOES_NOT_EXIST_AND_MAY_HAVE_BEEN_DELETED);
      return ctx.app.emit("error",err,ctx);
    }finally {
      const result = await delTopicContentService(id);
      ctx.body = result;
    }
  }
  //评论专题下内容
  async setTopicComment(ctx, next) {
    const { topic_content_id } = ctx.query;
    const { content } = ctx.request.body;
    const { userId } = ctx.user;
    const result = await setTopicCommentService(topic_content_id, content, userId);
    ctx.body = result;
  }
  //回复评论
  async replyComent(ctx, next) {
    const { commentId } = ctx.query;
    const { content } = ctx.request.body;
    const { userId } = ctx.user;
    const res = await getContentIdByComentId(commentId);
    const { topic_content_id } = res[0];
    const result = await replyComentService(commentId, content, userId, topic_content_id);
    ctx.body = result;
  }
  //收藏专题内容
  async subTopicContent(ctx, next) {
    const { userId } = ctx.user;
    const { topic_content_id } = ctx.query;
    const res = await isSubService(userId, topic_content_id);
    if (res.length === 0) {
      const result = await subTopicContentService(userId, topic_content_id);
      ctx.body = result;
    }
    else {
      ctx.body = "你已经收藏"
    }
  }
  //获取专题内容详情
  async getTopicContentDetail(ctx, next) 
  {
    try {
      const { topic_content_id } = ctx.query;
      const result = await getTopicContentDetailService(topic_content_id);
      ctx.body = result;
    } catch (e) {
      console.log(e)
    }
  }
  //加入专题
  async joinTopic(ctx,next)
  {
    const {userId}=ctx.user;
    const {topicId}=ctx.query;
    const result=await joinTopicService(userId,topicId);
    ctx.body=result;
  }
  //获取专题成员
  async getTopicMember(ctx,next)
  {
    const {topicId}=ctx.query;
    const result=await getTopicMemberService(topicId);
    ctx.body=result[0];
  }
  //获取推荐专题
  async getRecTopic(ctx,next)
  {
    const result=await getRecTopicService();
    ctx.body=result;
  }
}
module.exports = new TopicController()    