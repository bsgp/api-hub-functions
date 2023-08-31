module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.operation;
    if(!spec){
        draft.response.body.operation = "N/A";
        return;
    }
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.string('CODE', 10).notNullable();
        table.string('TEXT').defaultTo("");
        table.boolean('DELETED').notNullable().defaultTo(false);
        table.datetime('CREATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.datetime('UPDATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.string('CREATED_BY', 6).defaultTo('');
        table.string('UPDATED_BY', 6).defaultTo('');
        table.primary(['CODE']);
    }).run();
    
    const isSucceed = result.statusCode === 200;
    
    if(isSucceed){
        const list = [
            {
                "CODE": "C01",
                "TEXT": "트위스트"
            },
            {
                "CODE": "C02",
                "TEXT": "권취"
            },
            {
                "CODE": "C03",
                "TEXT": "재표면처리"
            },
            {
                "CODE": "C04",
                "TEXT": "밴딩"
            }
        ];
        await mysql.insert(spec.name, list).run();
    }
    
    draft.response.body[spec.name] = isSucceed ? "Succeed" : result.body;
}
