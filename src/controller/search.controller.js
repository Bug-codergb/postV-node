const {
  searchService
}=require('../service/search.service')  
class SearchController{
  async search(ctx,next)
  {
    const {keyword}=ctx.query;
    const result=await searchService(keyword);
    ctx.body=result;
  }
}
module.exports=new SearchController()