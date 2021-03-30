const Koa=require('koa');
const koaBodyparser=require('koa-bodyparser');
const app=new Koa();

const errorHandle=require('./errorHandle')
//用户
const userRouter=require('../router/user.router');
//动态
const momentRouter=require('../router/moment.router');
//评论
const commentRouter=require('../router/comment.router');
//标签
const tagRouter=require('../router/tag.router');
//文件
const fileRouter=require('../router/file.router');
//点赞
const thumbsRouter=require('../router/thumbs.router');
//banner
const bannerRouter=require('../router/banner.router');
//分类
const cateRouter=require('../router/category.router');
//搜索
const searchRouter=require('../router/search.router');
//点击量
const viewRouter=require('../router/view.router');
//视频
const videoRouter=require('../router/video.router')
//榜单
const toplistRouter=require('../router/toplist.router');
//专题
const topicRouter=require('../router/topic.router');

//审核
const checkRouter=require('../router/check.router');

//放映厅
const movieRouter=require('../router/movie.router');

//课程
const knowledgeRouter=require('../router/knowledge.router');
app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*")
    ctx.set('Access-Control-Allow-Headers','POST,Origin,Content-Type,Accept,authorization')
    await next()
})
app.use(koaBodyparser());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.use(momentRouter.routes());
app.use(momentRouter.allowedMethods());

app.use(commentRouter.routes());
app.use(commentRouter.allowedMethods());

app.use(tagRouter.routes());
app.use(tagRouter.allowedMethods());

app.use(fileRouter.routes());
app.use(fileRouter.allowedMethods());

app.use(thumbsRouter.routes());
app.use(thumbsRouter.allowedMethods());

app.use(bannerRouter.routes());
app.use(bannerRouter.allowedMethods());

app.use(cateRouter.routes());
app.use(cateRouter.allowedMethods());

app.use(searchRouter.routes());
app.use(searchRouter.allowedMethods());

app.use(viewRouter.routes());
app.use(viewRouter.allowedMethods());

app.use(videoRouter.routes());
app.use(videoRouter.allowedMethods());

app.use(toplistRouter.routes());
app.use(toplistRouter.allowedMethods());

app.use(topicRouter.routes());
app.use(topicRouter.allowedMethods());

app.use(checkRouter.routes());
app.use(checkRouter.allowedMethods());

app.use(movieRouter.routes());
app.use(movieRouter.allowedMethods());

app.use(knowledgeRouter.routes())
app.use(knowledgeRouter.allowedMethods())
app.on('error',errorHandle)
module.exports=app;