module.exports = async (draft, { sql }) => {
    const spec = draft.pipe.json.tables.outbound;
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.string('CODE', 16).notNullable().defaultTo('');
        table.string('NAME', 32).defaultTo('').comment('자재명');
        table.string('SITE_ID', 16).defaultTo('').comment('사이트 ID');
        table.integer('QTY', 16).defaultTo(0).comment('수량');
        table.boolean('RESTRICT').notNullable().comment('제한');
        
        table.boolean('DELETED').notNullable().defaultTo(false);
        table.datetime('CREATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.datetime('UPDATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));

        table.primary(['CODE']);
        table.unique(["NAME", "SITE_ID"]);
    }).run();
    
    draft.response.body[spec.name] = result.statusCode === 200 ? "Succeed" : result.body;
}

