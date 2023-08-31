module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.mseg;
    if(!spec){
        draft.response.body.mseg = "N/A";
        return;
    }
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.uuid('UUID').notNullable();
        table.string('MBLNR', 10).defaultTo('').comment('문서번호');
        table.string('MJAHR', 4).defaultTo('').comment('연도');
        table.string('MONAT', 2).defaultTo('').comment('전기기간');
        table.string('BUDAT', 8).notNullable().comment('전기일자');
        table.string('LIFNR', 10).defaultTo('').comment('공급업체코드');
        table.string('KUNNR', 10).defaultTo('').comment('고객코드');
        table.string('MATNR', 10).defaultTo('').comment('자재코드');
        table.string('LOTNO', 30).notNullable().comment('Lot번호');
        table.string('LOTNR', 30).defaultTo('').comment('관련 Lot번호');
        table.decimal('MENGE', 13, 3).defaultTo(0).comment('수량');
        table.string('MEINS', 3).defaultTo('').comment('단위');
        table.string('INSTP', 1).notNullable().defaultTo('S').comment('합격여부'); // 합(S)/불(F)
        table.string('DEFNC', 10).defaultTo('').comment('불량코드');
        table.string('ROUTG', 10).defaultTo('').comment('공정코드');
        table.string('BEEND', 1).defaultTo('').comment('작업시작/종료');
        table.string('OPERT', 10).defaultTo('').comment('작업코드');
        table.string('RESRC', 10).defaultTo('').comment('작업호기');
        table.string('OPESQ', 2).defaultTo('').comment('작업순서'); // 도금공정,표면처리공정에만
        table.string('NOTE').defaultTo('').comment('비고');
        
        table.boolean('DELETED').notNullable().defaultTo(false);
        table.datetime('CREATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.datetime('UPDATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.string('CREATED_BY', 6).defaultTo('');
        table.string('UPDATED_BY', 6).defaultTo('');
        table.primary(['UUID']);
        // table.unique(['LOTNO', 'ROUTG', 'BEEND']);
    }).run();
    
    draft.response.body[spec.name] = result.statusCode === 200 ? "Succeed" : result.body;
}
