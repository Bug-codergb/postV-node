const {
    getUserFollowService
}=require("../service/dynamic.service")
class DynamicController{
    //获取用户关注的用户
    async getUserFollow(ctx,next){
        const {userId}=ctx.user;
        const result=await getUserFollowService(userId);
        ctx.body=result[0];
    }
}
module.exports=new DynamicController();