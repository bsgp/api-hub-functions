module.exports = async (draft, {file, log}) => {
    const tables = {
        vendor: {
            name: "VENDOR_11",
            desc: "공급업체"
        },
        customer: {
            name: "CUSTOMER_4",
            desc: "고객"
        },
        material: {
            name: "MATERIAL_4",
            desc: "자재"
        },
        routing: {
            name: "ROUTING_4",
            desc: "공정"
        },
        resource: {
            name: "RESOURCE_4",
            desc: "생산설비(호기)"
        },
        scrap: {
            name: "SCRAP_4",
            desc: "불량내역"
        },
        operation: {
            name: "OPERATION_4",
            desc: "작업내역"
        },
        mseg: {
            name: "MSEG",
            desc: "물류 트랜잭션"
        }
    };
    
    const result = await file.upload("config/tables.json", tables, {gzip:true});
    log("upload tables config:", result);
    
    draft.pipe.json.tables = tables;
}
