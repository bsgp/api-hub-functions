module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.material;
    if(!spec){
        draft.response.body.material = "N/A";
        return;
    }
    
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.string('CODE', 10).notNullable();
        table.string('MATERIAL_TYPE', 1).notNullable();
        table.string('TEXT').defaultTo("");
        table.string('UNIT', 3).defaultTo(""); // 단위
        table.string('IDNTT', 20).defaultTo(""); // 식별코드
        table.string('ALTCO', 20).defaultTo(""); // 제품코드
        table.string('NOTE', 40).defaultTo(""); // 비고
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
                "CODE": "AC1100",
                "MATERIAL_TYPE": "P",
                "TEXT": "Ni-Cu 0.3x60 일반동, 압연",
                "IDNTT": "AC",
                "UNIT": "KG",
                "ALTCO": "Nicu1100",
                "NOTE": "표면처리 CP-1100"
            },
            {
                "CODE": "RM01",
                "MATERIAL_TYPE": "R",
                "TEXT": "0.2x45 일반동",
                "IDNTT": "CQ",
                "UNIT": "KG",
            }
        ];
        await mysql.insert(spec.name, list).run();
    }
    
    draft.response.body[spec.name] = isSucceed ? "Succeed" : result.body;
}
