const fs=require("fs");
const path=require("path");
const {
    isExistsFile
}=require("../utils/isExists");
const {
    delFile
}=require("../utils/deleteFile")
const errorType = require('../constants/errorType')
const {
    createService,
    momentCheckService,
    getMomentByIdService,
    getAllMomentService,
    delMomentService,
    getRecMomentService,
    getHotMomentService,
    subMomentService,
    cancelSubService,
    getDetailCountService,
    getBriefMomentService
} = require('../service/moment.service')
class MomentController {
    //发布动态
    async create(ctx, next) {
        const { userId } = ctx.user;
        let { title, content, cate } = ctx.request.body;
        const reg0 = /\n/g;
        const reg1 = /\s/g
        content = content.replace(reg0, '<br/>');
        content = content.replace(reg1, '&nbsp;');
        const result = await createService(userId, title, content, cate);
        ctx.body = result
    }
    async getMomentById(ctx, next) {
        try {
            const { momentId } = ctx.query;
            if (!momentId) {
                const err = new Error(errorType.PARAMETER_CANNOT_BE_EMPTY);
                return ctx.app.emit('error', err, ctx);
            }
            const result = await getMomentByIdService(momentId);
            let content = ''
            //console.log(result[0].originalNames, result[0].content)
            if (result[0].originalNames && result[0].content) {
                for (let i = 0; i < result[0].originalNames.length; i++) {
                    result[0].content = result[0].content.replace(/&nbsp;/g, '').replace(/\(/g, '').replace(/\)/g, '')
                    //console.log(result[0].content+'\n'); 
                    //console.log(result[0].originalNames[i]+"\n")
                    let reg = new RegExp(`\\[${result[0].originalNames[i]}\\]`, "g");
                    content = result[0].content.replace(reg, `<img src=${result[0].picUrl[i].picUrl} alt=${result[0].originalNames[i]} //>`)
                    result[0].content = content
                }
            }
            //console.log(result[0])
            const res = await getDetailCountService(momentId);
            // console.log(res[0])
            Object.assign(result[0], res[0]);
            ctx.body = result[0]
        } catch (e) {
            console.log(e)
        }
    }
    //获取最新动态
    async getAllMoment(ctx, next) {
        const { offset, limit } = ctx.query;
        const result = await getAllMomentService(offset, limit);
        //console.log(result)
        ctx.body = result;
    }
    //删除动态
    async delMoment(ctx, next) {
        const { momentId } = ctx.query;
        const result=await getBriefMomentService(momentId);
        const root=path.join(__dirname,'../../');
        const {type}=result[0];
        const {file}=result[0];
        if(type===1)
        {
            const videoPath=path.resolve(root,`upload/video/${file.video}`);
            const vioImgPath=path.resolve(root,`upload/videoImg/${file.cover}`);
            isExistsFile(videoPath).then(data=>{
                delFile(data).then(data=>{
                    console.log(data);
                })
            }).catch(e=>{
                console.log(e)
            })
            isExistsFile(vioImgPath).then(data=>{
                delFile(data).then(data=>{
                    console.log(data)
                })
            }).catch(e=>{
                console.log(e)
            })

        }
        else if(type===0)
        {
            file.forEach((item,index)=>{
              const picPath=path.resolve(root,`upload/picture/${item.pic}`);
              isExistsFile(picPath).then(data=>{
                delFile(data).then(data=>{
                    console.log(data);
                })
              }).catch(e=>{
                console.log(e);
              })
            })
        }
        const res= await delMomentService(momentId);
        ctx.body = res;
    }
    //获取推荐动态
    async getRecMoment(ctx, next) {
        const result = await getRecMomentService();
        ctx.body = result
    }
    //获取热们分类动态
    async getHotMoment(ctx, next) 
    {
        try {
            const { categoryId } = ctx.query;
            const result = await getHotMomentService(categoryId);
            let obj={}
            if(result[0])
            {
                obj={
                    categoryId: result[0].categoryId,
                    name: result[0].name,
                    moments: result
                }
            }
            else{
                obj={
                    categoryId:categoryId,
                    moments:[]
                }
            }
            ctx.body =obj; 
        } catch (e) {
            console.log(e)
        }
    }
    //收藏动态
    async subMoment(ctx, next) {
        const { momentId, userId } = ctx.query;
        const result = await subMomentService(momentId, userId);
        ctx.body = result;
    }
    //取消收藏
    async cancelSub(ctx, next) {
        const { momentId, userId } = ctx.query;
        const result = await cancelSubService(momentId, userId);
        ctx.body = result;
    }
    //获取动态的点赞数，收藏数，评论数
    async getDetailCount(ctx, next) {
        const { momentId } = ctx.query;
        const result = await getDetailCountService(momentId);
        ctx.body = result[0];
    }
}
module.exports = new MomentController()