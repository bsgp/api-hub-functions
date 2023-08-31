module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.customer;
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.string('CODE', 100);
        table.string('TEXT');
        table.boolean('DELETED').notNullable().defaultTo(false);
        table.datetime('CREATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.datetime('UPDATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.primary(['CODE']);
    }).run();
    
    draft.response.body[spec.name] = result.statusCode === 200 ? "Succeed" : result.body;
}
