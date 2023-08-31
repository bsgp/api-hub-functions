module.exports = async (draft) => {
  const result = draft.json.result;
  const conversion = convFn(result);
  draft.response.body = {
    ...draft.response.body,
    conversion,
  };
};

function convFn(data = {}, node = "", fullpath = "") {
  let conversion = [];
  let ckey;
  try {
    Object.keys(data).forEach((key) => {
      ckey = key;
      if (
        // key.includes("UUID") ||
        key.includes("listID") ||
        key.includes("Node")
      ) {
        return;
      }
      if (typeof data[key] === "object") {
        if (Array.isArray(data[key])) {
          if (key === "ConfirmationGroup") {
            const recurr = convFn(
              data[key][1],
              key,
              [fullpath, key].filter(Boolean).join("/")
            );
            conversion = conversion.concat(recurr);
          } else {
            const recurr = convFn(
              data[key][0],
              key,
              [fullpath, key].filter(Boolean).join("/")
            );
            conversion = conversion.concat(recurr);
          }
        } else if (data[key]) {
          const recurr = convFn(
            data[key],
            key,
            [fullpath, key].filter(Boolean).join("/")
          );
          conversion = conversion.concat(recurr);
        }
      } else if (data[key]) {
        if (key === "_value_1") {
          if (
            // node.includes("UUID") ||
            node.includes("ListID")
          ) {
            return;
          }
          conversion.push([node, node, [fullpath].filter(Boolean).join("/")]);
        } else {
          if (
            // key.includes("UUID") ||
            key.includes("listID")
          ) {
            return;
          } else
            conversion.push([
              key,
              node,
              [fullpath, key].filter(Boolean).join("/"),
            ]);
        }
      }
    });
  } catch (error) {
    conversion.push({ key: ckey });
  }
  return conversion;
}
