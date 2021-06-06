const {
    createService,
    getSpcolumnCateService,
    setMomentSpcolumnService,
    getSpcolumnDetailService
}=require("../service/spcolumn.service")
class SpcolumnController{
  async create(ctx,next){
      const {name}=ctx.request.body;
      const result=await createService(name);
      ctx.body=result;
  }
  //获取专栏分类
  async getSpcolumnCate(ctx,next){
    const result=await getSpcolumnCateService();
    ctx.body=result[0];
  }
  //为动态划分专栏
    async setMomentSpcolumn(ctx,next){
      const {spId,momentId}=ctx.request.body;
      const result=await setMomentSpcolumnService(spId,momentId);
      ctx.body=result[0];
    }
  //获取专栏下分类内容
  async getSpcolumnDetail(ctx,next){
      const {spId,cateId,offset,limit}=ctx.query;
      const result=await getSpcolumnDetailService(spId,cateId,offset,limit);
      ctx.body=result;
  }
}
module.exports=new SpcolumnController()