module.exports = async (draft, { request, sql }) => {
	const { tables } = draft.pipe.json;
	
	async function getDatabaseData(field) {
	    return sql("mysql").select(getTableByIndicator(field)).where(getNotDeleted).run();
	}

    const [grpDels, grpHeaders, grpMembers, grpItems, grpMetas, jobHeaders] = await Promise.all(["gdeleted", "gheader", "gmember", "gitem", "gmeta", "jheader"].map(getDatabaseData))
    
    draft.response.statusCode = 200;
    draft.response.body = {
        gdeleted: grpDels.body,
        gheader: grpHeaders.body,
        gmember: grpMembers.body,
        gitem: grpItems.body,
        gmeta: grpMetas.body,
        jheader: jobHeaders.body
    };
    
    /* tools */
    function getTableByIndicator(tableIndicator) {
        return tables[tableIndicator].name;
    }
  
    function getNotDeleted(builder) {
        return builder.whereNull("DELETED").orWhere({ DELETED: false });
    }
}
