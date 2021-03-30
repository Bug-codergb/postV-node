const {
    createService,
    getMomentByUserSeervice,
    followService,
    followCancelService,
    getUserMsgService,
    getRecUserService
}=require('../service/user.service')
class UserController{
    async create(ctx,next){
        const {userName,password}=ctx.request.body;
        const result=await createService(userName,password);
        ctx.body=result;
    }
    async getMomentByUserId(ctx,next)
    {
        const {userId}=ctx.query;
        const result=await getMomentByUserSeervice(userId);
        ctx.body=result[0];
    }
    //关注用户
    async follow(ctx,next)
    {
        const {userId}=ctx.query;
        const {userName}=ctx.user;
        const id=ctx.user.userId;
        const result=await followService(id,userName,userId);
        ctx.body=result;
    }
    //取消关注
    async cancelFollow(ctx,next)
    {
        const {userId}=ctx.query;
        const id=ctx.user.userId;
        const result=await followCancelService(id,userId);
        ctx.body=result;
    }
    //用户详情
    async getUserMsg(ctx,next)
    {
        const {userId}=ctx.query;
        const result=await getUserMsgService(userId)
        ctx.body=result[0];
    }
    //获取推荐用户
    async getRecUser(ctx,next)
    {
        const result=await getRecUserService();
        ctx.body=result
    }
}
module.exports=new UserController()