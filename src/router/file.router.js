const Router=require('koa-router');
const fileRouter=new Router();
const {authVerify}=require('../middleware/auth.middleware');
const {
    avatarHandle,
    pictureHandle
}=require('../middleware/file.middleware');
const {
    create,
    getAvatar,
    addMomentPic,
    getMomentPic,
    deleteMomentPic
}=require('../controller/file.controller')

fileRouter.post('/upload/avatar',authVerify,avatarHandle,create)
fileRouter.get('/user/avatar',getAvatar)
//为动态配图
fileRouter.post('/upload/moment/picture',authVerify,pictureHandle,addMomentPic);
//获取动态图片
fileRouter.get('/moment/picture',getMomentPic)
//删除动态配图
fileRouter.post('/delete/moment/picture',authVerify,deleteMomentPic)
module.exports=fileRouter;
  