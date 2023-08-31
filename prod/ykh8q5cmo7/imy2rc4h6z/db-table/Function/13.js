module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.mitem;
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.uuid('UUID').notNullable().defaultTo('');
        table.string('MD_ID', 32).defaultTo('').comment('메타 ID');
        table.string('CODE', 32).defaultTo('').comment('선택지 코드');
        table.string('TEXT', 32).defaultTo('').comment('선택지 내용');
        table.boolean('DISABLED').notNullable().comment('선택지 사용여부');
        
        table.boolean('DELETED').notNullable().defaultTo(false);
        table.datetime('CREATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.datetime('UPDATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.primary(['UUID']);
        table.unique(spec.unique);
    }).run();
    
    draft.response.body[spec.name] = result.statusCode === 200 ? "Succeed" : result.body;
}
