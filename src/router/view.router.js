/*点击量 */
const Router=require('koa-router');
const viewRouter=new Router({prefix:"/view"});
const {create}=require('../controller/view.controller');
const {authVerify}=require('../middleware/auth.middleware');
viewRouter.post('/',authVerify,create);

module.exports=viewRouter;