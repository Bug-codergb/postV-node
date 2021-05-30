const fs=require("fs");
const {
    isExistsFile
}=require("../utils/isExists")
async function getSizePic(type,fileName,path){
    let newFileName=fileName;
    try{
        if(type){
            fileName=fileName+"-small";
            await isExistsFile(`${path}/${fileName}`);
            newFileName=fileName;
        }
        return newFileName;
    }catch(e){
        return newFileName;
    }
}
module.exports={
    getSizePic
}