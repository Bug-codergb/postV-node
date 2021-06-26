const Router=require('koa-router');
const commentRouter=new Router({prefix:'/comment'});

const {
    authVerify,
    updateVerify
}=require('../middleware/auth.middleware');
const {commentImgHandle}=require("../middleware/file.middleware");
const {
    create,
    reply,
    getAllComment,
    getCommentById,
    delComment,
    getMomentCom,
    uploadComImg,
    getCommentImg
}=require('../controller/comment.controller')
commentRouter.post('/',authVerify,create);
commentRouter.post('/reply',authVerify,reply);
commentRouter.get('/all',getAllComment);
commentRouter.get('/',getCommentById);
//删除评论
commentRouter.post('/delete',authVerify,updateVerify,delComment)
//获取动态评论
commentRouter.get('/moment',getMomentCom);
//上传评论图片
commentRouter.post("/upload/pic",authVerify,commentImgHandle,uploadComImg);
//获取评论图片
commentRouter.get("/image",getCommentImg);
module.exports=commentRouter;