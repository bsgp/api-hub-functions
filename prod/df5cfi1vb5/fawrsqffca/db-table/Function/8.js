module.exports = async (draft, {sql}) => {
    const spec = draft.pipe.json.tables.resource;
    if(!spec){
        draft.response.body.resource = "N/A";
        return;
    }
    const mysql = sql('mysql');
    
    const result = await mysql.table.create(spec.name, function(table){
        table.charset('utf8mb4');
        table.string('ROUTG', 10).notNullable();
        table.string('CODE', 10).notNullable();
        table.string('TEXT').defaultTo("");
        table.boolean('DELETED').notNullable().defaultTo(false);
        table.datetime('CREATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.datetime('UPDATED_AT', { precision: 6 }).defaultTo(mysql.fn.now(6));
        table.string('CREATED_BY', 6).defaultTo('');
        table.string('UPDATED_BY', 6).defaultTo('');
        table.primary(['CODE', 'ROUTG']);
    }).run();
    
    const isSucceed = result.statusCode === 200;
    
    if(isSucceed){
        const list = [
{  "ROUTG": "R30",  "CODE": "A",  "TEXT": "도금 A라인(1호)"},{  "ROUTG": "R30",  "CODE": "B",  "TEXT": "도금 B라인(1호)"},{  "ROUTG": "R30",  "CODE": "C",  "TEXT": "도금 C라인(2호)"},{  "ROUTG": "R30",  "CODE": "D",  "TEXT": "도금 D라인(2호)"},{  "ROUTG": "R30",  "CODE": "E",  "TEXT": "도금 E라인(3호)"},{  "ROUTG": "R30",  "CODE": "F",  "TEXT": "도금 F라인(3호)"},{  "ROUTG": "R30",  "CODE": "G",  "TEXT": "도금 G라인(4호)"},{  "ROUTG": "R30",  "CODE": "H",  "TEXT": "도금 H라인(4호)"},{  "ROUTG": "R30",  "CODE": "I",  "TEXT": "도금 I라인(5호)"},{  "ROUTG": "R30",  "CODE": "J",  "TEXT": "도금 J라인(5호)"},{  "ROUTG": "R30",  "CODE": "K",  "TEXT": "도금 K라인(6호)"},{  "ROUTG": "R30",  "CODE": "L",  "TEXT": "도금 L라인(6호)"},{  "ROUTG": "R30",  "CODE": "M",  "TEXT": "도금 M라인(7호)"},{  "ROUTG": "R30",  "CODE": "N",  "TEXT": "도금 N라인(7호)"},{  "ROUTG": "R30",  "CODE": "O",  "TEXT": "도금 O라인(8호)"},{  "ROUTG": "R30",  "CODE": "P",  "TEXT": "도금 P라인(8호)"},{  "ROUTG": "R30",  "CODE": "Q",  "TEXT": "도금 Q라인(9호)"},{  "ROUTG": "R30",  "CODE": "R",  "TEXT": "도금 R라인(9호)"},
{  "ROUTG": "R50",  "CODE": "A",  "TEXT": "표면 A라인(1호)"},{  "ROUTG": "R50",  "CODE": "B",  "TEXT": "표면 B라인(1호)"},{  "ROUTG": "R50",  "CODE": "C",  "TEXT": "표면 C라인(2호)"},{  "ROUTG": "R50",  "CODE": "D",  "TEXT": "표면 D라인(2호)"},{  "ROUTG": "R50",  "CODE": "E",  "TEXT": "표면 E라인(3호)"},{  "ROUTG": "R50",  "CODE": "F",  "TEXT": "표면 F라인(3호)"},{  "ROUTG": "R50",  "CODE": "G",  "TEXT": "표면 G라인(4호)"},{  "ROUTG": "R50",  "CODE": "H",  "TEXT": "표면 H라인(4호)"},{  "ROUTG": "R50",  "CODE": "I",  "TEXT": "표면 I라인(5호)"},{  "ROUTG": "R50",  "CODE": "J",  "TEXT": "표면 J라인(5호)"},{  "ROUTG": "R50",  "CODE": "K",  "TEXT": "표면 K라인(6호)"},{  "ROUTG": "R50",  "CODE": "L",  "TEXT": "표면 L라인(6호)"},{  "ROUTG": "R50",  "CODE": "M",  "TEXT": "표면 M라인(7호)"},{  "ROUTG": "R50",  "CODE": "N",  "TEXT": "표면 N라인(7호)"},{  "ROUTG": "R50",  "CODE": "O",  "TEXT": "표면 O라인(8호)"},{  "ROUTG": "R50",  "CODE": "P",  "TEXT": "표면 P라인(8호)"},{  "ROUTG": "R50",  "CODE": "Q",  "TEXT": "표면 Q라인(9호)"},{  "ROUTG": "R50",  "CODE": "R",  "TEXT": "표면 R라인(9호)"},{  "ROUTG": "R50",  "CODE": "S",  "TEXT": "표면 S라인(10호)"},{  "ROUTG": "R50",  "CODE": "T",  "TEXT": "표면 T라인(10호)"},{  "ROUTG": "R50",  "CODE": "U",  "TEXT": "표면 U라인(11호)"},{  "ROUTG": "R50",  "CODE": "V",  "TEXT": "표면 V라인(11호)"},{  "ROUTG": "R50",  "CODE": "W",  "TEXT": "표면 W라인(11호)"},{  "ROUTG": "R50",  "CODE": "X",  "TEXT": "표면 X라인(11호)"},
{"ROUTG": "R40","CODE": "1","TEXT": "열처리 1호"},{"ROUTG": "R40","CODE": "2","TEXT": "열처리 2호"},{"ROUTG": "R40","CODE": "3","TEXT": "열처리 3호"},{"ROUTG": "R40","CODE": "4","TEXT": "열처리 4호"},{"ROUTG": "R40","CODE": "5","TEXT": "열처리 5호"},
{  "ROUTG": "R20",  "CODE": "1",  "TEXT": "압연 1호"},{  "ROUTG": "R20",  "CODE": "2",  "TEXT": "압연 2호"},{  "ROUTG": "R20",  "CODE": "3",  "TEXT": "압연 3호"},
];
        await mysql.insert(spec.name, list).run();
    }
    
    draft.response.body[spec.name] = isSucceed ? "Succeed" : result.body;
}
