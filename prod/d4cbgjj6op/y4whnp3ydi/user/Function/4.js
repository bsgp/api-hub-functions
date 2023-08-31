module.exports = async (draft, { request }) => {
  if (draft.response.statusCode !== 200) {
    draft.pipe.json.terminateFlow = true;
    return;
  }

  const ifId = request.body.InterfaceId;

  const nodeMap = {
    "PRM-501": "Function#5",
    "PRM-502": "Function#6",
    "PRM-503": "Function#7",
    "PRM-504": "Function#8",
  };

  draft.pipe.json.nextNodeKey = nodeMap[ifId];
};
