const jwt=require('jsonwebtoken');
const {PRIVATE_KEY}=require('../app/config');
const {
    getUserMsgService
}=require('../service/user.service')
class LoginController{
    async login(ctx,next)
    {
        const {userId,userName,avatarUrl,auth}=ctx.user;
        const token=jwt.sign({userId,userName},PRIVATE_KEY,{
            expiresIn: 60*60*24,
            algorithm:'RS256'
        })
        const result=await getUserMsgService(userId);
        ctx.body={
            userId,userName,token,avatarUrl,auth
        }
    }   
}
module.exports=new LoginController()