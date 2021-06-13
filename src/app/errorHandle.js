const errorType=require('../constants/errorType');
function errorHandle(error,ctx){
    let status=0;
    let message="";
    switch(error.message){
        case errorType.USER_NAME_OR_PASSWORD_IS_NOT_NULL:
            status=400;
            message="用户名或者密码不能为空!";break;
        case errorType.USER_ALREADY_EXISTS:
            status=409;
            message="用户名已经存在";break
        case errorType.USER_NAME_OR_PASSWORD_IS_INCORRECT:
            status=400;
            message="用户名或者密码错误";break;
        case errorType.PERMISSION_DENIED:  
            status=401;
            message="请登录";break;
        case errorType.NO_PERMISSION_TO_MODIFY:
            status=403;
            message="您没有修改的权限";break;
        case errorType.RESOURCE_DOES_NOT_EXIST:
            status=404;
           message="资源不存在";break;
        case errorType.PARAMETER_CANNOT_BE_EMPTY:
            status=400;
            message="请求错误";break;
        case errorType.VERIFICATION_CODE_ERROR:
           status=400;
           message="验证码错误";break;
        case errorType.THE_FILE_DOES_NOT_EXIST_AND_MAY_HAVE_BEEN_DELETED:
            status=500;
            message="文件不存在,可能已经删除";break;
        default:
            status=404;
            message="资源不存在";
    }
    ctx.body=message;
    ctx.status=status;
}
module.exports=errorHandle;