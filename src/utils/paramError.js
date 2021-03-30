const errorType=require('../constants/errorType');
function paramError(ctx)
{
  const err=new Error(errorType.PARAMETER_CANNOT_BE_EMPTY);
  ctx.app.emit('error',err,ctx);
}
module.exports={
  paramError
}