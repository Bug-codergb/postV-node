const Router=require('koa-router');
const thumbsRouter=new Router({prefix:'/thumbs'});
const {authVerify}=require('../middleware/auth.middleware');
const {
    addThumbs,
    delThumbs
}=require('../controller/thumbs.controller')
/*判断用户是否存在权限 */
const {thumbAuthVerify}=require('../middleware/thumbs.middleware')
//点赞
thumbsRouter.post('/',authVerify,addThumbs);
//取消赞
thumbsRouter.post('/delete',authVerify,thumbAuthVerify,delThumbs);
module.exports=thumbsRouter;