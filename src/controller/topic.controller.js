const fs = require('fs');
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
  getTopicContentDetailService
} = require('../service/topic.service')
class TopicController {
  async create(ctx, next) {
    const { name } = ctx.request.body;
    const result = await createService(name);
    ctx.body = result;
  }
  async getAllTopic(ctx, next) {
    const { offset, limit } = ctx.query;
    const result = await getAllTopicService(offset, limit);
    ctx.body = result;
  }
  //为话题配图
  async setTopicImg(ctx, next) {
    const { userId } = ctx.query;
    const { topicId } = ctx.query;
    const { file } = ctx.req;
    const { mimetype, filename, size } = file;
    const result = await setTopicImgService(userId, topicId, mimetype, filename, size);
    ctx.body = result;
  }
  //获取话题封面
  async getTopicCover(ctx, next) {
    const { id } = ctx.query;
    const result = await getTopicCoverService(id);
    const { fileName, mimetype } = result[0];
    ctx.set('content-type', mimetype);
    ctx.body = fs.createReadStream(`./upload/topicImg/${fileName}`)
  }
  //删除话题
  async delTopic(ctx, next) {
    const { topicId } = ctx.query;
    const result = await delTopicService(topicId);
    ctx.body = result[0];
  }
  //为话题添加内容
  async addContent(ctx, next) {
    let { title, content } = ctx.request.body;
    const { topicId } = ctx.query;
    const reg0 = /\n/g;
    const reg1 = /\s/g;
    content = content.replace(reg0, '<br/>').replace(reg1, '&nbsp;');
    const result = await addContentService(topicId, title, content);
    ctx.body = result;
  }
  async addContentImg(ctx, next) {
    const { topic_content_Id } = ctx.query;
    const { files } = ctx.req;
    const { userId } = ctx.user;
    for (let file of files) {
      const { mimetype, filename, size, originalname } = file;
      const result = await addContentImgService(topic_content_Id, userId, mimetype, filename, originalname, size);
      ctx.body = result;
    }
  }
  //获取话题图片
  async getTopicImg(ctx, next) {
    const { id } = ctx.query;
    const result = await getTopicImgService(id);
    // console.log(result[0]);
    const { fileName, mimetype } = result[0];
    ctx.set('content-type', mimetype);
    ctx.body = fs.createReadStream(`./upload/topicContentImg/${fileName}`)
  }
  //获取话题内容
  async getTopicContent(ctx, next) {
    try {
      const { offset, limit, topicId } = ctx.query;
      const result = await getTopicContentService(topicId, offset, limit);
      console.log(result[0])
      if (result[0].content) {
        for (let item of result[0].content) {
          if (item.originalNames) {
            for (let i in item.originalNames) {
              item.content = item.content.replace(/&bsp;/g, '').replace(/\(/g, '').replace(/\)/g, '')
              let reg = new RegExp(`\\[${item.originalNames[i].originalName}\\]`, 'g');
              item.content = item.content.replace(reg, `<img src=${item.picUrl[i].picUrl} />`)
            }
          }
        }
      }
      ctx.body = result[0];
    } catch (e) {
      console.log(e)
    }
  }
  //删除话题下内容
  async delTopicContent(ctx, next) {
    const { id } = ctx.query;
    const result = await delTopicContentService(id);
    ctx.body = result;
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
      if (result.originalNames && result.content) 
      {
        for (let i = 0; i < result.originalNames.length; i++) {
          result.content = result.content.replace(/&nbsp;/g, '').replace(/\(/g, '').replace(/\)/g, '');
          result.originalNames[i].originalName=result.originalNames[i].originalName.replace(/\s/g,'')
          //console.log(result.content+'\n'); 
          //console.log(result.originalNames[i].originalName+"\n")
          let reg = new RegExp(`\\[${result.originalNames[i].originalName}\\]`, "g");
          result.content= result.content.replace(reg, `<img src=${result.picUrl[i].picUrl} alt=${result.originalNames[i].originalName} //>`)
        }
      }  
      ctx.body = result;
    } catch (e) {
      console.log(e)
    }
  }
}
module.exports = new TopicController()