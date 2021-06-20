const Router=require('koa-router');
const tagRouter=new Router({prefix:'/tag'});

const {
    authVerify,updateVerify
}=require('../middleware/auth.middleware')
const {
    create,
    addTag,
    deleteTag,
    getAllTag,
    delTag
}=require('../controller/tag.controller')
tagRouter.post('/',authVerify,create);
//为动态添加标签
tagRouter.post('/moment',authVerify,addTag)
tagRouter.post('/moment/delete',authVerify,updateVerify,deleteTag);
//获取所有tag
tagRouter.get("/all",getAllTag);
//删除标签
tagRouter.post("/delete",authVerify,delTag);
module.exports=tagRouter