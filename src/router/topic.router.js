const Router=require('koa-router');
const topicRouter=new Router({prefix:'/topic'});
const {authVerify}=require('../middleware/auth.middleware')
const {topicImgHandle,topicCoverHandle,reSizePic}=require('../middleware/file.middleware');
const {
  create,
  getAllTopic,
  delTopic,
  addContent,
  addContentImg,
  getTopicImg,
  getTopicContent,
  delTopicContent,
  setTopicImg,
  getTopicCover,
  setTopicComment,
  replyComent,
  subTopicContent,
  getTopicContentDetail,
  joinTopic,
  getTopicMember,
  getRecTopic,
  cancelSub
}=require('../controller/topic.controller')
//添加话题
topicRouter.post('/',authVerify,create);
//获取所有话题
topicRouter.get('/all',getAllTopic);

//为话题封面配图
topicRouter.post('/img',authVerify,topicCoverHandle,reSizePic,setTopicImg)
//获取话题配图
topicRouter.get('/cover',getTopicCover)

//删除话题
topicRouter.post('/delete',authVerify,delTopic)

//为话题添加内容
topicRouter.post('/content',authVerify,addContent)

topicRouter.post('/content/img',authVerify,topicImgHandle,reSizePic,addContentImg) ;
//获取话题内容图片
topicRouter.get('/content/img',getTopicImg);

//获取话题内容
topicRouter.get('/content',getTopicContent);
//收藏话题内容
topicRouter.post('/content/sub',authVerify,subTopicContent);
//取消收藏
topicRouter.post("/content/sub/cancel",authVerify,cancelSub);

//删除话题下内容
topicRouter.post('/content/delete',authVerify,delTopicContent)
//评论话题下内容
topicRouter.post('/comment',authVerify,setTopicComment);
//回复评论
topicRouter.post('/comment/reply',authVerify,replyComent);
//获取专题内容详情
topicRouter.get('/content/detail',getTopicContentDetail)

//加入专题
topicRouter.post('/join',authVerify,joinTopic);
//获取专题成员
topicRouter.get('/member',getTopicMember);
//获取推荐专题
topicRouter.get('/recommend',getRecTopic)
module.exports=topicRouter;