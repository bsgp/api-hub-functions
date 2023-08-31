module.exports = async (draft, { request, sql }) => {
	const { level, tables } = draft.pipe.json;
	
	if (!level) return;
	
	const metaRels = await sql("mysql")
	    .select(getTableByIndicator("mrelation"))
	    .where({ REL_ID: level })
	    .andWhere(getNotDeleted)
	    .run();
	const targetHeaderIDs = metaRels.body.list.map(({ ID }) => ID);
	
	const metaHeaders = await sql("mysql")
	    .select(getTableByIndicator("mheader"))
	    .whereIn("ID", targetHeaderIDs)
	    .andWhere({ ENABLED: true })
	    .andWhere(getNotDeleted)
	    .run();
	const targetItemIDs = metaHeaders.body.list.map(({ ID }) => ID);
	
	const metaItems = await sql("mysql")
	    .select(getTableByIndicator("mitem"))
	    .whereIn("MD_ID", targetItemIDs)
	    .andWhere(getNotDeleted)
	    .run();
	    
	draft.response.statusCode = 200;
	draft.response.body = {
	    mrelation: metaRels.body,
	    mheader: metaHeaders.body,
	    mitem: metaItems.body
	};
	
  function getTableByIndicator(tableIndicator) {
    return tables[tableIndicator].name;
  }

  function getNotDeleted(builder) {
    return builder.whereNull("DELETED").orWhere({ DELETED: false });
  }

}
