module.exports = async (draft, { request, sql }) => {
  const builder = sql("mysql");
  const { method, table, unique } = draft.pipe.json;

  if (method !== "GET") {
    return;
  }
  
  const queryNotDeleted = function() {
    this.whereNull("deleted").orWhere({ deleted: false });
  };
  
  const { type, ...options } = request.params;
  
  const entries = Object.entries(options).map(([key, value]) => ([key.toLowerCase(), value]));
  const queryParams = Object.fromEntries(entries);
  
  if (entries.length) {
    draft.response = await builder.select(table).where(queryParams).andWhere(queryNotDeleted).run();  
  } else {
    draft.response = await builder.select(table).where(queryNotDeleted).run();    
  }
};
