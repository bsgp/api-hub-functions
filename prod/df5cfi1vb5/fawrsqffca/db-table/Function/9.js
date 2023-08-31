module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.scrap;
    if(!spec){
        draft.response.body.scrap = "N/A";
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
                "CODE": "D01",
                "TEXT": "스크래치"
            },
            {
                "CODE": "D02",
                "TEXT": "측면쏠림"
            },
            {
                "CODE": "D03",
                "TEXT": "흰줄"
            },
            {
                "CODE": "D04",
                "TEXT": "검은줄"
            },
            {
                "CODE": "D05",
                "TEXT": "흰점"
            },
            {
                "CODE": "D06",
                "TEXT": "검은점"
            },
            {
                "CODE": "D07",
                "TEXT": "음영"
            },
            {
                "CODE": "D08",
                "TEXT": "사선얼룩"
            },
            {
                "CODE": "D09",
                "TEXT": "얼룩"
            },
            {
                "CODE": "D10",
                "TEXT": "권취"
            },
            {
                "CODE": "D11",
                "TEXT": "밴딩"
            },
            {
                "CODE": "D12",
                "TEXT": "트위스트"
            },
            {
                "CODE": "D13",
                "TEXT": "갈변"
            },
            {
                "CODE": "D14",
                "TEXT": "찍힘"
            }
        ];
        await mysql.insert(spec.name, list).run();
    }
    
    draft.response.body[spec.name] = isSucceed ? "Succeed" : result.body;
}
