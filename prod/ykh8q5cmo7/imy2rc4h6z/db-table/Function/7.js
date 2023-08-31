module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.gfile;
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.uuid('UUID').notNullable().defaultTo('');
        table.string('NAME', 32).defaultTo('').comment('파일명');
        table.string('GROUP_ID', 32).defaultTo('').comment('할당그룹 ID');
        table.string('USER_ID', 32).defaultTo('').comment('생성유저 ID');
        table.text('URL').defaultTo('').comment('파일 URL');
        
        table.boolean('DELETED').notNullable().defaultTo(false);
        table.datetime('CREATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.datetime('UPDATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.primary(['UUID']);
        table.unique(spec.unique);
    }).run();
    
    draft.response.body[spec.name] = result.statusCode === 200 ? "Succeed" : result.body;
}
