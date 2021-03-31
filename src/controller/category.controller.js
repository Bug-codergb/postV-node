const {
  createService,
  getAllCateService,
  getNameByCateId,
  getCateDetailService
}=require('../service/category.service')
class CategoryController{
  async create(ctx,next)
  {
     try{
      const {name}=ctx.request.body;
      const result=await createService(name);
      ctx.body=result;
     }catch(e)
     {
       console.log(e)
     }
  }
  async getAllCate(ctx,next)
  {
    const {offset,limit}=ctx.query;
    const result=await getAllCateService(offset,limit);
    ctx.body=result;
  }
  
  //获取分类下视频
  async getCateDetail(ctx,next)
  {
    const {categoryId}=ctx.query;
    const res=await getNameByCateId(categoryId);
    const result=await getCateDetailService(categoryId);
    ctx.body={
      categoryId:categoryId,  
      name:res[0].name,
      videos:result
    };
  }
}
module.exports=new CategoryController();