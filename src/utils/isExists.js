const fs=require("fs");
const path=require("path");
function isExistsFile(path)
{
  return new Promise((resolve,reject)=>{
     fs.access(path,(err)=>{
       if(!err)
       {
         resolve(path)
       }
       else{
         let err=new Error("文件不存在");
         reject(err)
       }
     })
  })
}
module.exports={
  isExistsFile
}