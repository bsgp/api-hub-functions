module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.mheader;
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.uuid('UUID').notNullable().defaultTo('');
        table.string('ID', 32).defaultTo('').comment('항목 ID');
        table.string('NAME', 32).defaultTo('').comment('항목명');
        table.string('TYPE_ID', 32).defaultTo('').comment('항목형태');
        table.boolean('ENABLED').notNullable().comment('항목사용여부');
        table.boolean('MANDATORY').notNullable().comment('항목의무여부');
        
        table.boolean('DELETED').notNullable().defaultTo(false);
        table.datetime('CREATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.datetime('UPDATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.primary(['UUID']);
        table.unique(spec.unique);
    }).run();
    
    draft.response.body[spec.name] = result.statusCode === 200 ? "Succeed" : result.body;
}
