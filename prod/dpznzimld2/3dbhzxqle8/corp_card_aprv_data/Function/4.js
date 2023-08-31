module.exports = async (draft, { sql }) => {
  const routeTo = {
    exit: "Output#2",
  };
  const setFailedResponse = (msg, statusCd = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = statusCd;
    draft.json.nextNodeKey = routeTo.exit;
  };

  const { tableName, orderBy } = draft.json.tableConfig;
  const {
    CARD_NO,
    APPR_DATE_FROM,
    APPR_DATE_TO,
    STATE,
    isProcessed,
    selectAll,
  } = draft.json.requestQuery;

  if (selectAll) {
    // pass
  } else if (
    !CARD_NO ||
    !APPR_DATE_FROM ||
    !APPR_DATE_TO ||
    !["A", "B"].includes(STATE) ||
    !["yes", "no", "completedWriting", "all"].includes(isProcessed)
  ) {
    setFailedResponse("Check request queries and try again");
    return;
  }

  const ARR_CARD_NO = String(CARD_NO).split(",");

  const mysql = sql("mysql");

  const builder = mysql
    .select(tableName)
    .orderBy(orderBy)
    .where("DELETED", false);
  if (!selectAll) {
    builder
      .whereIn("CARD_NO", ARR_CARD_NO)
      .andWhere("STATE", STATE)
      .andWhere(function () {
        this.whereBetween("APPR_DATE", [APPR_DATE_FROM, APPR_DATE_TO]);
      });

    switch (isProcessed) {
      case "yes": {
        builder.andWhere(function () {
          this.whereNotNull("INVOICE_NO");
        });
        break;
      }
      case "no": {
        builder.andWhere(function () {
          this.whereNull("INVOICE_NO").whereNull("COMPLETED_WRITING");
        });
        break;
      }
      case "completedWriting": {
        builder.andWhere(function () {
          this.whereNull("INVOICE_NO").whereNotNull("COMPLETED_WRITING");
        });
        break;
      }
      default:
        break;
    }
  }
  if (selectAll) {
    builder.limit(100);
  }
  const result = await builder.run();
  if (result.statusCode !== 200) {
    setFailedResponse(
      result.body.message || "Cannot find data",
      result.statusCode
    );
    return;
  }

  draft.response.body = result.body;
};
