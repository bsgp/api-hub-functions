module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.mseg;
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.string('FYEAR', 4);
        table.string('FMONT', 2);
        table.string('FMONT', 2);
        
        table.boolean('DELETED').notNullable().defaultTo(false);
        table.datetime('CREATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.datetime('UPDATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.primary(['FYEAR','FMONT']);
    }).run();
    
    draft.response.body[spec.name] = result.statusCode === 200 ? "Succeed" : result.body;
}
