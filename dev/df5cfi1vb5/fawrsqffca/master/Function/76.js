module.exports = async (draft, ctx) => {
    const method = draft.pipe.json.method;
    const isCU = ["POST","PATCH"].includes(method);
    if(!isCU){
        return;
    }
    
    const isCreate = method === "POST";
    const isUpdate = method === "PATCH";
    
    const reqBody = ctx.request.body;
    
    const type = reqBody.Type.toUpperCase();
    const newData = ctx.util.clone(reqBody.Data);
    let oldData = {};
    
    if(isCreate){
        if(!newData.code){
            draft.response.statusCode = 400;
            draft.response.body = {
                errorMessage: "code값은 필수입니다"
            };
            return;
        }
    }
    
    const code = newData.code.toUpperCase();
    newData.code = code;
    
    const path = [type, ["code",code].join("="), "data.json"].join("/");

    const existing = await ctx.file.exist(path);
    if(isCreate){
        if(existing){
            draft.response.statusCode = 400;
            draft.response.body = {
                errorMessage: "이미 존재하는 코드입니다"
            };
            return;
        }
    }else if(isUpdate){
        if(!existing){
            draft.response.statusCode = 400;
            draft.response.body = {
                errorMessage: "존재하는 않는 코드입니다"
            };
            return;
        }
        
        const result = await ctx.file.get(path, {toJSON:true});
        oldData = result;
    }
    
    const data = {...oldData, ...newData};
    const result = await ctx.file.upload(path, data);
    if(result){
        draft.response.body = data;
    }else{
        draft.response.statusCode = 500;
        draft.response.body = {
            errorMessage: "마스터 데이터 업로드 실패했습니다."
        };
    }
}
