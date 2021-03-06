const { APP_HOST, APP_PORT } = require('../app/config')
const {
  getAllCheckService,
  checkMomentService,
  getAllCheckVioService
} = require('../service/check.service')

class CheckController {
  async getAllCheck(ctx, next) {
    const {offset,limit}=ctx.query;
    const result = await getAllCheckService(offset,limit);
    ctx.body = result;
  }
  //审核动态
  async checkMoment(ctx,next)
  {
    const {momentId}=ctx.query;
    const result=await checkMomentService(momentId);
    ctx.body=result;
  }
  //获取所有check video
  async getAllCheckVio(ctx,next){
    const {cateId,offset,limit}=ctx.query;
    const result=await getAllCheckVioService(cateId,offset,limit);
    ctx.body=result;
  }
}
module.exports = new CheckController()