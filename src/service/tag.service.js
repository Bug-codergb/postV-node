const connection=require('../app/database')
class TagService{
    async createService(tagName)
    {
        const id=new Date().getTime();
        const sql=`insert into tag (tagId,tagName) values(?,?)`;
        const result=await connection.execute(sql,[id,tagName]);
        result[0].tagId=id;
        return result[0]
    }
    async getTagByName(name)
    {
        const sql=`select * from tag where tagName=?`;
        const result=await connection.execute(sql,[name]);
        return result[0];
    }
    //判断用户是否已经为动态添加tag
    async isExistTagService(momentId,tagId)
    {
        const sql=`select * from moment_tag where momentId=? and tagId=?`;
        const result=await connection.execute(sql,[momentId,tagId]);
        return result[0]
    }
    async addTagService(momentId,tagId)
    {
        const sql=`insert into moment_tag(momentId,tagId) values(?,?)`;
        const result=await connection.execute(sql,[momentId,tagId]);
        return result[0]
    }
    //删除用户的某一tag
    async deleteTagService(momentId,tagId)
    {
        const sql=`delete from moment_tag where momentId=? and tagId=?`;
        const result=connection.execute(sql,[momentId,tagId]);
        return result[0];
    }
    //获取所有tag
    async getAllTagService(offset,limit){
        const sql=`
        select t.tagId as id,tagName as name,t.createTime,t.updateTime,
        count(t.tagId) as count
        from tag as t
        left join moment_tag as mt on t.tagId=mt.tagId
        GROUP BY t.tagId
        limit ?,?`;
        const result=await connection.execute(sql,[offset,limit]);
        return result[0];
    }
    //删除标签
    async delTagService(id){
        const sql=`
        delete from tag where tagId=?`;
        const result=await connection.execute(sql,[id]);
        return result[0];
    }
}
module.exports=new TagService()