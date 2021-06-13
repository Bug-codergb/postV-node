const {
    getUserFollowService,
    getUserDynamicService
}=require("../service/dynamic.service")
class DynamicController{
    //获取用户关注的用户
    async getUserFollow(ctx,next){
        const {userId}=ctx.user;
        const result=await getUserFollowService(userId);
        ctx.body=result[0];
    }
    //获取用户dynamic
    async getUserDynamic(ctx,next){
        const {userId,cateId}=ctx.query;
        const result=await getUserDynamicService(userId,cateId);
        ctx.body=result;
    }
}
module.exports=new DynamicController();