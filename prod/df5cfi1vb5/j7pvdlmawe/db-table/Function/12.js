module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.lotno;
    if(!spec){
        draft.response.body.lotno = "N/A";
        return;
    }
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.string('LOTNO', 30).notNullable().comment('LOT 번호');
        table.string('SEQNC', 30).defaultTo('').comment('일련번호/캐릭터');
        table.string('SQBSK', 30).defaultTo('').comment('일련번호 기준 키');
        table.string('EXTLO', 30).defaultTo('').comment('External LOT 번호');
        table.boolean('PRTFL').defaultTo(false).comment('출력 여부');
        
        table.boolean('DELETED').notNullable().defaultTo(false);
        table.datetime('CREATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.datetime('UPDATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.string('CREATED_BY', 6).defaultTo('');
        table.string('UPDATED_BY', 6).defaultTo('');
        table.primary(['LOTNO']);
    }).run();
    
    draft.response.body[spec.name] = result.statusCode === 200 ? "Succeed" : result.body;
}
