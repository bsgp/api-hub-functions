module.exports = async (draft, { request, util, file }) => {
    const { tryit } = util;
    
    const { method } = request;
    const tables = await file.get("config/tables.json", { gziped:true, toJSON:true });
    const reqTable = tryit(() => request.params.type);
    const dataRows = tryit(() => request.body.data);
    const { name: table } = tables[reqTable.toLowerCase()];
    
    Object.assign(draft.pipe.json, { method, table, dataRows });
}