module.exports = async (draft, {request, file, log}) => {
    const tables = {
        vendor: {
            name: "VENDOR_21",
            desc: "공급업체"
        },
        customer: {
            name: "CUSTOMER_21",
            desc: "고객"
        },
        material: {
            name: "MATERIAL_21",
            desc: "자재"
        },
        routing: {
            name: "ROUTING_21",
            desc: "공정"
        },
        resource: {
            name: "RESOURCE_21",
            desc: "생산설비(호기)"
        },
        scrap: {
            name: "SCRAP_21",
            desc: "불량내역"
        },
        operation: {
            name: "OPERATION_21",
            desc: "작업내역"
        },
        mseg: {
            name: "MSEG_21",
            desc: "물류 트랜잭션"
        },
        lotno: {
            name: "LOTNO_21",
            desc: "LOT 번호"
        },
        lotno_rel: {
            name: "LOTNO_REL_21",
            desc: "LOT 번호 관계기록"
        }
    };
    
    const result = await file.upload("config/tables.json", tables, {gzip:true});
    log("upload tables config:", result);
    
    if(request.params.name){
        draft.pipe.json.tables = {[request.params.name]: tables[request.params.name]};
    }else{
        draft.pipe.json.tables = tables;
    }
}
