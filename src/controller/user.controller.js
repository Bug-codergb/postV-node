const path=require("path");
const errorType=require("../constants/errorType");
const {
    isExistsFile
}=require("../utils/isExists");
const {
    delFile
}=require("../utils/deleteFile");
const {
    AVATAR
}=require("../constants/uploadPath")
const {
    createService,
    getMomentByUserSeervice,
    followService,
    followCancelService,
    getUserMsgService,
    getRecUserService,
    getUserSubService,
    getUserJoinTopicService,
    getUserMsgByIdService,
    setUserDescService,
    getUserSpcolumnService,
    getAllUserService,
    delUserVice,
    getUserAvatarFile
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
    //获取用户收藏
    async getUserSub(ctx,next)
    {
        const {userId}=ctx.query;
        const result=await getUserSubService(userId);
        ctx.body=result[0];
    }
    //用户加入的专题
    async getUserJoinTopic(ctx,next)
    {
        const {userId}=ctx.query;
        const result=await getUserJoinTopicService(userId);
        ctx.body=result[0];
    }
    //设置拥护简介
    async setUserDesc(ctx,next)
    {
        const {userId}=ctx.user;
        const {content}=ctx.request.body;
        // const res=await getUserMsgByIdService(userId);
        // const {desc}=res[0];
        const result=await setUserDescService(userId,content);
        ctx.body=result;
    }
    //获取用户其它专栏
    async getUserSpcolumn(ctx,next){
        const {userId}=ctx.query;
        const result=await getUserSpcolumnService(userId);
        ctx.body=result;
    }
    //获取所有用户
    async getAllUser(ctx,next){
        const {offset,limit}=ctx.query;
        const result=await getAllUserService(offset,limit);
        ctx.body=result;
    }
    //删除用户
    async delUser(ctx,next){
        const {userId}=ctx.user;
        const targetUserId=ctx.query.userId;
        const result=await getUserMsgByIdService(userId);
        const {auth}=result[0];
        try{
            if(auth===1){
                const avatarFile=await getUserAvatarFile(targetUserId);
                if(avatarFile.length!==0){
                    const {fileName}=avatarFile[0];
                    const avatarPath=path.resolve(__dirname,"../../",`${AVATAR}/${fileName}`);
                    const data=await isExistsFile(avatarPath);
                    await delFile(data);
                }
            }
        }catch(e){
            const err=new Error(errorType.THE_FILE_DOES_NOT_EXIST_AND_MAY_HAVE_BEEN_DELETED);
            return ctx.app.emit('error',err,ctx);
        }finally {
            const result=await delUserVice(targetUserId);
            ctx.body=result[0];
        }
    }
}
module.exports=new UserController()