module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.gitem;
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.uuid('UUID').notNullable().defaultTo('');
        table.string('JOB_ID', 32).defaultTo('').comment('작업 ID');
        table.string('USER_ID', 32).defaultTo('').comment('소유유저 ID');
        table.string('GROUP_ID', 32).defaultTo('').comment('할당그룹 ID');
        
        table.boolean('DELETED').notNullable().defaultTo(false);
        table.datetime('CREATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.datetime('UPDATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.primary(['UUID']);
        table.unique(spec.unique);
    }).run();
    
    draft.response.body[spec.name] = result.statusCode === 200 ? "Succeed" : result.body;
}
