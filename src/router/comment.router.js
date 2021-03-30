const Router=require('koa-router');
const commentRouter=new Router({prefix:'/comment'});

const {
    authVerify,
    updateVerify
}=require('../middleware/auth.middleware')
const {
    create,
    reply,
    getAllComment,
    getCommentById,
    delComment,
    getMomentCom
}=require('../controller/comment.controller')
commentRouter.post('/',authVerify,create);
commentRouter.post('/reply',authVerify,reply);
commentRouter.get('/all',getAllComment);
commentRouter.get('/',getCommentById);
commentRouter.post('/delete',authVerify,updateVerify,delComment)
//获取动态评论
commentRouter.get('/moment',getMomentCom)
module.exports=commentRouter;