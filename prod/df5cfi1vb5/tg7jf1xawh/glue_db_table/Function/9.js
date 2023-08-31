module.exports = async (draft, { env, loop }) => {
  draft.json.connection = JSON.parse(
    env[`SAP_${env.CURRENT_ALIAS.toUpperCase()}`]
  );

  if (loop.row.IsSapTable) {
    draft.json.nextNodeKey = "Function#12";
  } else {
    draft.json.parameters = {
      FUNCNAME: loop.row.Name,
    };
    draft.json.nextNodeKey = "RFC#8";
  }
};
