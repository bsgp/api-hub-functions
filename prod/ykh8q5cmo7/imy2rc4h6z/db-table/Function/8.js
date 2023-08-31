module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.gheader;
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.uuid('UUID').notNullable().defaultTo('');
        table.string('ID', 32).defaultTo('').comment('그룹 ID');
        table.string('NAME', 32).defaultTo('').comment('그룹명');
        table.string('LEVEL', 32).defaultTo('').comment('그룹 종류');
        table.boolean('DRAFT').notNullable().comment('그룹메타 작성여부');
        table.text('UPPER').defaultTo('').comment('상위 그룹');
        table.text('LOWER').defaultTo('').comment('하위 그룹');
        
        table.boolean('DELETED').notNullable().defaultTo(false);
        table.datetime('CREATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.datetime('UPDATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.primary(['UUID']);
        table.unique(spec.unique);
    }).run();
    
    draft.response.body[spec.name] = result.statusCode === 200 ? "Succeed" : result.body;
}

