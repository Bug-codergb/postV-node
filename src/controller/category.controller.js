const {
  createService,
  getAllCateService,
  getCateDetailService,
    addCateConService
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
  //获取分类内容
  async getCateDetail(ctx,next)
  {
    try{
      const {categoryId}=ctx.query;
      const {offset=0,limit=15}=ctx.query;
      const result=await getCateDetailService(categoryId,offset,limit);
      ctx.body=result;
    }catch(e)  
    {
      console.log(e);
    } 
  }
  //添加分类子分类
  async addCateCon(ctx,next){
      const {name,cateId}=ctx.request.body;
      const result=await addCateConService(name,cateId);
      ctx.body=result;
  }
}
module.exports=new CategoryController();