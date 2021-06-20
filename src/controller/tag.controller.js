const {
    createService,
    getTagByName,
    addTagService,
    isExistTagService,
    deleteTagService,
    getAllTagService,
    delTagService
}=require('../service/tag.service')
class TagController{
    async create(ctx,next)
    {
        const {tagName}=ctx.request.body;
        for(let name of tagName)
        {
            const res=await getTagByName(name);
            //console.log(res)
            if(res.length===0)
            {
                const result =await createService(name)
                console.log(result);
            }
        }
    }
    async addTag(ctx,next)
    {
        const {momentId}=ctx.query;
        const {tagName}=ctx.request.body
        for(let name of tagName)
        {
            const isExist=await getTagByName(name);  
            if(isExist.length===0)
            {
                const result=await createService(name);
                isExist.push({
                    tagId:result.tagId
                })
            }
            const {tagId}=isExist[0];
            //console.log(tagId,momentId)
            const res=await isExistTagService(momentId,tagId);
            if(res.length===0)
            {
                const result=await addTagService(momentId,tagId);
            }
        }
        ctx.body={
            status:200,
            message:'OK'
        }
    }
    async deleteTag(ctx,next)
    {
        const {momentId,tagId}=ctx.query;
        const result=await deleteTagService(momentId,tagId);
        ctx.body={status:200};
    }
    async getAllTag(ctx,next){
        const {offset,limit}=ctx.query;
        const result=await getAllTagService(offset,limit);
        ctx.body=result;
    }
    //删除标签
    async delTag(ctx,next){
        const {id}=ctx.query;
        const result=await delTagService(id);
        ctx.body=result;
    }
}
module.exports=new TagController() 