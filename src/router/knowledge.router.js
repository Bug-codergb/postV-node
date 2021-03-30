const Router=require('koa-router');
const knowledgeRouter=new Router({prefix:'/knowledge'});
const {authVerify}=require('../middleware/auth.middleware');
const {knowHandle,knowContentHandle}=require('../middleware/file.middleware')
const {
  create,
  setKnowImg,
  getKnowImg,
  uploadKonw,
  getKnowContent,
  getAllKnow,
  getKnowDetail,
  getKnowUrl
}=require('../controller/knowledge.controller')
//发布课程内容
knowledgeRouter.post('/',authVerify,create);
//为课程配图
knowledgeRouter.post('/img',authVerify,knowHandle,setKnowImg);
//获取课程图片
knowledgeRouter.get('/image',getKnowImg);
//上传课程
knowledgeRouter.post('/content',authVerify,knowContentHandle,uploadKonw);
//获取课程内容
knowledgeRouter.get('/content',getKnowContent);

//获取所有课程
knowledgeRouter.get('/all',getAllKnow);
//获取标题下内容
knowledgeRouter.get('/detail',getKnowDetail)
//获取课程播放地址
knowledgeRouter.get('/url',getKnowUrl)
module.exports=knowledgeRouter