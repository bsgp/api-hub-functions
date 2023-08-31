// module.exports = async (draft, { rfc, file, env }) => {
//   const rfcFn = draft.json.rfcFn;
//   const params = draft.json.params;

//   if (rfcFn !== "BAPI_PO_GETITEMS") {
//     return;
//   }

//   const result = [];
//   try {
//     const fnName = "SMB_UIE_GET_PURCHASING_GROUP";
//     const rfcIF = {
//       ashost: env.RFC_ASHOST,
//       client: env.RFC_CLIENT,
//       user: env.RFC_USER,
//       passwd: env.RFC_PASSWORD,
//       lang: "en",
//     };
//     const filter = {};
//     const opt = { version: "750" };

//     const rfcResult = await rfc.invoke(fnName, filter, rfcIF, opt);
//     if (rfcResult.statusCode !== 200) {
//       throw new Error("RFC Call statusCode error");
//     }
//     draft.response.body.origin = rfcResult;
//     const rfcData = rfcResult.body.result;
//     // rfcData.PO_ITEMS.forEach((item) => {
//     //   const fIndex = result.findIndex((po) =>
// po.PO_NUMBER === item.PO_NUMBER);

//     //   if (fIndex > -1) {
//     //     result[fIndex].items.push({ ...item });
//     //     result[fIndex].ENTRY_COUNT++;
//     //   } else
//     //     result.push({
//     //       PO_NUMBER: item.PO_NUMBER,
//     //       VENDOR: rfcData.VENDOR,
//     //       items: [{ ...item }],
//     //       ENTRY_COUNT: 1,
//     //     });
//     // });

//     const uploadFileName = `/srm/test/result.js`;
//     await file.upload(uploadFileName, result, { gzip: true });
//   } catch (error) {
//     const uploadFileName = `/srm/test/error.js`;
//     await file.upload(uploadFileName, error.message, { gzip: true });
//     throw error;
//   }

//   draft.response.body[fnName] = result;
//   draft.response.body.E_STATUS = "S";
// };
