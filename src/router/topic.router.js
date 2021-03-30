const Router=require('koa-router');
const topicRouter=new Router({prefix:'/topic'});
const {authVerify}=require('../middleware/auth.middleware')
const {topicImgHandle}=require('../middleware/file.middleware');
const {
  create,
  getAllTopic,
  delTopic,
  addContent,
  addContentImg,
  getTopicImg,
  getTopicContent,
  delTopicContent
}=require('../controller/topic.controller')
//添加话题
topicRouter.post('/',authVerify,create);
//获取所有话题
topicRouter.get('/all',getAllTopic);
//删除话题
topicRouter.post('/delete',authVerify,delTopic)
//为话题添加内容
topicRouter.post('/content',authVerify,addContent)
topicRouter.post('/content/img',authVerify,topicImgHandle,addContentImg) ;
//获取话题图片
topicRouter.get('/content/img',getTopicImg);
//获取话题内容
topicRouter.get('/content',getTopicContent);
//删除话题下内容
topicRouter.post('/content/delete',authVerify,delTopicContent)
module.exports=topicRouter;