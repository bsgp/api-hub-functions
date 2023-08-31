const { isObject } = require("@bsgp/lib-core/types");

function spread(columns, fields, row, options = {}){
    if(fields === undefined){
        return [{}, columns];
    }

    const {users = {}, multiple = false} = options;
    return [fields.reduce((acc, each) => {
        const fieldName = each.B || each;
        const onlyBegin = !!each.B;
        
        const subKey = [row.ROUTG, fieldName].join("-");
        let subSeq = 1;
        if(columns[subKey]){
            if(columns[subKey][row.LOTNO]){
                if(columns[subKey][row.LOTNO][row.BEEND]){
                    subSeq = columns[subKey][row.LOTNO][row.BEEND] + 1;
                    if(subSeq === 4){
                        subSeq = 3;
                    }
                }
            }
        }
        
        let transferValue = true;
        if(row.BEEND === "B"){
            if (onlyBegin === false){
                transferValue = false;
            }
        }else if(row.BEEND === "E"){
            if(onlyBegin === true){
                transferValue = false;
            }
        }
        
        const subKey2 = multiple === true ? [subKey, subSeq].join("-") : subKey;
        if(columns[subKey] === undefined){
            columns[subKey] = {
                maxCount: 0
            };
        }
        if(multiple === true){
            if(columns[subKey][row.LOTNO] === undefined){
                columns[subKey][row.LOTNO] = {};
            }
            columns[subKey][row.LOTNO][row.BEEND] = subSeq;
            
            if(columns[subKey].maxCount < subSeq){
                columns[subKey].maxCount = subSeq;
            }
        }
        if(transferValue){
            
            if(fieldName === "CREATED_BY"){
                const user = users[row[fieldName]];
                acc[subKey2] = user && user.name;
            }else if(fieldName === "BUDAT"){
                acc[subKey2] = [row[fieldName].substring(0,4), row[fieldName].substring(4,6), row[fieldName].substring(6,8)].join("-");
            }else{
                acc[subKey2] = row[fieldName];
            }
        }
        
        return acc;
    }, {}), columns];
}


function parse(value) {
  if (isNaN(value)) {
    return value;
  } else {
    return parseFloat(value);
  }
}

const dirObj = {
  up: "asc",
  asc: "asc",
  ascending: "asc",
  down: "des",
  des: "des",
  desc: "des",
  descending: "des"
};

function getDir(dir) {
  return !dir ? "asc" : dirObj[dir] || "asc";
}
function fnSort(fields, direction) {
  return function(_a, _b) {
    const dir = getDir(direction);
    return fields.reduce((result, field) => {
      if (result !== 0) {
        return result;
      }
      const fieldName = isObject(field) ? field.name : field;
      const fieldDir = isObject(field) ? getDir(field.dir) : dir;

      const aValue = parse(_a[fieldName]);
      const bValue = parse(_b[fieldName]);

      console.log("aValue:", aValue, "bValue:", bValue);
      if (aValue > bValue) {
        return fieldDir === "asc" ? 1 : -1;
      }
      if (aValue < bValue) {
        return fieldDir === "asc" ? -1 : 1;
      }
      return result;
    }, 0);
  };
}

const FIELDS = {
    "R10": ["MENGE", "EXTLO", "BUDAT", "CREATED_BY"],
    "R20": [{"B":"RESRC"}, "BUDAT", "CREATED_BY", "INSTP", "DEFNC"],
    "R30": ["BUDAT", "CREATED_BY", "INSTP", "DEFNC"],
    "R40": [{"B":"RESRC"}, "BUDAT", "CREATED_BY", "INSTP", "DEFNC"],
    "R50": [{"B":"RESRC"}, "BUDAT", "CREATED_BY", "INSTP", "DEFNC"],
    "R60": [{"B":"OPERT"}, "BUDAT", "CREATED_BY", "INSTP", "DEFNC"],
    "R70": ["MENGE", "BUDAT", "CREATED_BY", "INSTP", "DEFNC"]
}

const columnOptions = {
    "R60": {
        multiple: true
    },
    "R70": {
        multiple: true
    }
}

module.exports = async (draft, { request }) => {
	const msegList = draft.pipe.json.msegList;
	const keys = draft.pipe.json.keys;
	const users = draft.pipe.json.users;
	
	msegList.sort(fnSort(["LOTNO","ROUTG","CREATED_AT"]));
	
	let columns = {};
	let masterKeys = {
	    OPERT: {},
	    DEFNC: {},
	};
	
	const partsList = [];
	
	const keyList = msegList.reduce((acc, row)=>{
	    const key = keys[row.LOTNO];
	    if(key !== undefined){
	        if(acc[key] === undefined){
	            acc[key] = {};
	        }
	        
	        const fields = FIELDS[row.ROUTG];

	        const option = columnOptions[row.ROUTG] || {};
	        const [parts, cols] = spread(columns, fields, row, {users, multiple:option.multiple});
	        columns = cols;
            Object.keys(parts).forEach(subKey => {
                acc[key][subKey] = parts[subKey];
            })
            partsList.push({[row.ROUTG]: parts});
	        
	        Object.keys(masterKeys).forEach(fieldName => {
	            masterKeys[fieldName][row[fieldName]] = "";
	        })
	    }
	    return acc;
	},{})
	
	const rawList = [];
	
	const results = Object.keys(keyList).map(key => {
	    const [rawLotno, halbLotno] = key.split("-");
	    const row = {
	        RAW_LOTNO: rawLotno,
	        HALB_LOTNO: halbLotno,
	        ...keyList[key]
	    };
	    
	    if(rawLotno === halbLotno){
	        rawList.push(row)
	        return false;
	    }
	    return row;
	}).filter(Boolean);
	
	rawList.forEach(each => {
	    const lotMaster = draft.pipe.json.lotMasters[each.RAW_LOTNO];
	    if(lotMaster){
	        each["R10-EXTLO"] = lotMaster.EXTLO;
	    }
	    const rowsHasSameRaw = results.filter(row => row.RAW_LOTNO === each.RAW_LOTNO);
	    if(rowsHasSameRaw.length > 0){
	        rowsHasSameRaw.forEach(row => {
    	        Object.keys(each).filter(key => !["RAW_LOTNO", "HALB_LOTNO"].includes(key)).forEach(key => {
    	            row[key] = each[key];
    	        })
    	    })
	    }else{
	        results.push(each);
	    }
	});
	
	const master = Object.keys(masterKeys).reduce((acc,fieldName) => {
	    acc[fieldName] = Object.keys(masterKeys[fieldName]);
	    return acc;
	}, {})
	const columns2 = Object.keys(FIELDS).reduce((acc, routg)=>{
	    const fields = FIELDS[routg];
	    fields.forEach(each => {
	        const fieldName = each.B || each;
	        const key = [routg, fieldName].join("-");
	        const option = columnOptions[routg] || {};
	        
    	    
	        if(option.multiple){
	           // if(columns[key] === undefined || columns[key].maxCount === 0){
	           //     acc.push([key, 1].join("-"));
        	   // }else{
        	   //     for(let idx = 0; idx < columns[key].maxCount; idx += 1){
        	   //         acc.push([key, idx + 1].join('-'));
        	   //     }
        	   // }
        	    for(let idx = 0; idx < 3; idx += 1){
    	            acc.push([key, idx + 1].join('-'));
    	        }
	        }else{
	            acc.push(key);
	        }
	    })
	    return acc;
	},[]);
	columns2.sort(function(left,right){
	    const leftArr = left.split("-");
	    const rightArr = right.split("-");
	    if(leftArr.length < 3){
	        leftArr.push("0");
	        rightArr.push("0");
	    }
	    const alpha = [leftArr[0], leftArr[2]].join("-");
	    const beta = [rightArr[0], rightArr[2]].join("-");
	    
	    if(alpha < beta){
	        return -1;
	    }else if(alpha > beta){
	        return 1;
	    }else {
	        return 0;
	    }
	});
	
	draft.pipe.json.master = master;
	
	draft.response.body = {
	    count: results.length,
	    list: results,
	    columns: ["RAW_LOTNO","HALB_LOTNO"].concat(columns2)
	};
}
