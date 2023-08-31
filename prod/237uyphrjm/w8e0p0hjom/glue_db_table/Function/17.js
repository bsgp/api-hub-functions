module.exports = async (draft, { loop }) => {
  const { builder } = draft.ref;
  // const { dbName } = draft.json;

  const query = builder.select("ALL_TAB_COLUMNS");
  query.where({ TABLE_NAME: loop.row.Name });

  // const query = builder
  //   .select(
  //     builder.knex.raw(`
  //       [o].[name] AS [table],
  //       [c].[name] AS [name],
  //       [t].[name] AS [data_type],
  //       [c].[max_length] AS [max_length],
  //       [c].[precision] AS [numeric_precision],
  //       [c].[scale] AS [numeric_scale],
  //       CASE WHEN [c].[is_nullable] = 0 THEN
  //         'NO'
  //       ELSE
  //         'YES'
  //       END AS [is_nullable],
  //       object_definition ([c].[default_object_id]) AS [default_value],
  //       [i].[is_primary_key],
  //       [i].[is_unique],
  //       CASE [c].[is_identity]
  //       WHEN 1 THEN
  //         'YES'
  //       ELSE
  //         'NO'
  //       END AS [has_auto_increment],
  //       OBJECT_NAME ([fk].[referenced_object_id]) AS [foreign_key_table],
  //       COL_NAME ([fk].[referenced_object_id],
  //         [fk].[referenced_column_id]) AS [foreign_key_column],
  //       [cc].[is_computed] as [is_generated],
  //       [cc].[definition] as [generation_expression]`)
  //   )
  //   .from(
  //     builder.knex.raw(`??.[sys].[columns] [c]`, [
  //       builder.knex.client.connectionSettings.database,
  //     ])
  //   )
  //   .joinRaw(
  //     `JOIN [sys].[types] [t] ON [c].[user_type_id] = [t].[user_type_id]`
  //   )
  //   .joinRaw(`JOIN [sys].[tables] [o] ON [o].[object_id] = [c].[object_id]`)
  //   .joinRaw(`JOIN [sys].[schemas] [s] ON [s].[schema_id] = [o].[schema_id]`)
  //   .joinRaw(
  //     [
  //       "LEFT JOIN [sys].[computed_columns] AS [cc] ON [cc].[object_id]",
  //       "[c].[object_id] AND [cc].[column_id] = [c].[column_id]",
  //     ].join(" = ")
  //   )
  //   .joinRaw(
  //     [
  //       "LEFT JOIN [sys].[foreign_key_columns] AS [fk]",
  //       "ON [fk].[parent_object_id] = [c].[object_id]",
  //       "AND [fk].[parent_column_id] = [c].[column_id]",
  //     ].join(" ")
  //   )
  //   .joinRaw(
  //     `LEFT JOIN (
  //         SELECT
  //           [ic].[object_id],
  //           [ic].[column_id],
  //           [ix].[is_unique],
  //           [ix].[is_primary_key],

  //           MAX([ic].[index_column_id]) OVER (
  //             partition by [ic].[index_id], [ic].[object_id]
  //           ) AS index_column_count,

  //           ROW_NUMBER() OVER (
  //             PARTITION BY [ic].[object_id], [ic].[column_id]
  //             ORDER BY [ix].[is_primary_key] DESC, [ix].[is_unique] DESC
  //           ) AS index_priority
  //         FROM
  //           [sys].[index_columns] [ic]
  //         JOIN [sys].[indexes] AS [ix] ON [ix].[object_id] = [ic].[object_id]
  //           AND [ix].[index_id] = [ic].[index_id]
  //       ) AS [i]
  //       ON [i].[object_id] = [c].[object_id]
  //       AND [i].[column_id] = [c].[column_id]
  //       AND ISNULL([i].[index_column_count], 1) = 1
  //       AND ISNULL([i].[index_priority], 1) = 1`
  //   );

  // query.where({ 's.name': this.schema });
  // query.andWhere({ "o.name": loop.row.Name });
  // query.limit(10);

  const result = await query.run();

  draft.json.dbResult = result.body;

  if (result.body.errorNum) {
    draft.response.body = {
      errorMessage: result.body.message,
      statement: result.body.statement,
      errorNum: result.body.errorNum,
    };
    draft.json.terminateFlow = true;
    return;
  }
  // draft.response = result;
  // draft.json.finalBody.list.push({
  //   tableName: loop.row.Name,
  //   [builder.knex.client.connectionSettings.database]: result,
  // });
};
