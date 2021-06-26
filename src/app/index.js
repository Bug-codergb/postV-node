const Koa=require('koa');
const koaBodyparser=require('koa-bodyparser');
const webSocket=require('koa-websocket');
const app=new Koa();
const webApp=webSocket(app);
const errorHandle=require('./errorHandle');

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

//课程
const knowledgeRouter=require('../router/knowledge.router');
//广告
const advertRouter=require('../router/advertisement.router');
//聊天
const chatRouter=require("../router/chat.router");
//系统消息
const messageRouter=require("../router/message.router");
//验证码
const captchaRouter=require("../router/imgVerify.router");
//频道
const channelRouter=require("../router/channel.router");
//专栏
const spcolumnRouter=require("../router/spcolumn.router");
//动态(dynamic)
const dynamicRouter=require("../router/dynamic.router");

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

app.use(knowledgeRouter.routes())
app.use(knowledgeRouter.allowedMethods());

app.use(advertRouter.routes());
app.use(advertRouter.allowedMethods());

app.use(chatRouter.routes())
app.use(chatRouter.allowedMethods());

app.use(messageRouter.routes());
app.use(messageRouter.allowedMethods());

app.use(captchaRouter.routes());
app.use(captchaRouter.allowedMethods());

app.use(channelRouter.routes());
app.use(channelRouter.allowedMethods());

app.use(spcolumnRouter.routes());
app.use(spcolumnRouter.allowedMethods());

app.use(dynamicRouter.routes());
app.use(dynamicRouter.allowedMethods());

webApp.ws.use(chatRouter.routes());
webApp.ws.use(messageRouter.routes());

app.on('error',errorHandle)
module.exports={
    app,
    webApp,
};