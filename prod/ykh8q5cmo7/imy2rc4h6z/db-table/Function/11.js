module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.gmeta;
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.uuid('UUID').notNullable().defaultTo('');
        table.string('GROUP_ID', 32).defaultTo('').comment('할당그룹 ID');
        table.string('META_ID', 32).defaultTo('').comment('메타항목 ID');
        table.text('META_VALUE').defaultTo('').comment('입력 메타값');
        
        table.boolean('DELETED').notNullable().defaultTo(false);
        table.datetime('CREATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.datetime('UPDATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.primary(['UUID']);
        table.unique(spec.unique);
    }).run();
    
    draft.response.body[spec.name] = result.statusCode === 200 ? "Succeed" : result.body;
}
