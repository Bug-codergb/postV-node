const { APP_HOST, APP_PORT } = require('../app/config')
const {
  getAllCheckService,
  addCheckMomentService
} = require('../service/check.service')

class CheckController {
  async getAllCheck(ctx, next) {
    const result = await getAllCheckService();
    ctx.body = result;
  }
}
module.exports = new CheckController()