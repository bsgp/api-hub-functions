module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.lotno_rel;
    if(!spec){
        draft.response.body.lotno_rel = "N/A";
        return;
    }
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.string('LOTNO_B', 30).notNullable().comment('LOT 번호 Begin');
        table.string('LOTNO_E', 30).notNullable().comment('LOT 번호 End');
        table.string('ROUTG', 10).notNullable().comment('공정 코드');
        table.boolean('SHALLOW').notNullable().comment('Shallow');
        
        table.boolean('DELETED').notNullable().defaultTo(false);
        table.datetime('CREATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.datetime('UPDATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.string('CREATED_BY', 6).defaultTo('');
        table.string('UPDATED_BY', 6).defaultTo('');
        table.primary(['LOTNO_B', 'LOTNO_E']);
    }).run();
    
    draft.response.body[spec.name] = result.statusCode === 200 ? "Succeed" : result.body;
}
