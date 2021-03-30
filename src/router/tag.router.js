const Router=require('koa-router');
const tagRouter=new Router({prefix:'/tag'});

const {
    authVerify,updateVerify
}=require('../middleware/auth.middleware')
const {
    create,
    addTag,
    deleteTag
}=require('../controller/tag.controller')
tagRouter.post('/',authVerify,create);
//为动态添加标签
tagRouter.post('/moment',authVerify,addTag)
tagRouter.post('/moment/delete',authVerify,updateVerify,deleteTag)
module.exports=tagRouter