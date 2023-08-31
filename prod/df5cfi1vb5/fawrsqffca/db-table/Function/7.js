module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.routing;
    if(!spec){
        draft.response.body.routing = "N/A";
        return;
    }
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.string('CODE', 10).notNullable();
        table.string('MODE', 1).defaultTo("").comment('작업모드'); // 단일작업(S)/입출고작업(D)
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
                "CODE": "R10",
                "MODE": "S",
                "TEXT": "원재료입고"
            },
            {
                "CODE": "R20",
                "MODE": "D",
                "TEXT": "면취"
            },
            {
                "CODE": "R30",
                "MODE": "D",
                "TEXT": "도금"
            },
            {
                "CODE": "R40",
                "MODE": "D",
                "TEXT": "열처리"
            },
            {
                "CODE": "R50",
                "MODE": "D",
                "TEXT": "표면처리"
            },
            {
                "CODE": "R60",
                "MODE": "D",
                "TEXT": "재작업"
            },
            {
                "CODE": "R70",
                "MODE": "S",
                "TEXT": "출하검사"
            },
            {
                "CODE": "R80",
                "MODE": "S",
                "TEXT": "출하"
            }
        ];
        await mysql.insert(spec.name, list).run();
    }
    
    draft.response.body[spec.name] = isSucceed ? "Succeed" : result.body;
}
