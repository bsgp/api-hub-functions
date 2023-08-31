module.exports = async (draft, { request, sql }) => {
	const { group, tables } = draft.pipe.json;
	
	if (!group) return;
	
	const grpFiles = await sql("mysql")
	    .select(getTableByIndicator("gfile"))
	    .where({ GROUP_ID: group })
	    .andWhere(getNotDeleted)
	    .run();
	    
	draft.response.statusCode = 200;
// 	draft.response.body = {
// 	    grpFiles: grpFiles.body
// 	};
    Object.assign(draft.response.body, { gfile: grpFiles.body });
	
  function getTableByIndicator(tableIndicator) {
    return tables[tableIndicator].name;
  }

  function getNotDeleted(builder) {
    return builder.whereNull("DELETED").orWhere({ DELETED: false });
  }

}
