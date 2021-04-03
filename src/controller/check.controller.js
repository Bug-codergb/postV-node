const { APP_HOST, APP_PORT } = require('../app/config')
const {
  getAllCheckService,
  checkMomentService
} = require('../service/check.service')

class CheckController {
  async getAllCheck(ctx, next) {
    const result = await getAllCheckService();
    ctx.body = result;
  }
  //审核动态
  async checkMoment(ctx,next)
  {
    const {momentId}=ctx.query;
    const result=await checkMomentService(momentId);
    ctx.body=result;
  }
}
module.exports = new CheckController()