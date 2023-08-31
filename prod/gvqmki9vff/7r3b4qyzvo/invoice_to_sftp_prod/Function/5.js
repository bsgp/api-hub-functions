module.exports = async (draft, { ftp, file, log }) => {
  const isExist = draft.pipe.json.isExist;
  if (!isExist) {
    const buf = Buffer.from(draft.pipe.json.toTime, "utf8").toString();
    await file.upload("/send/opentext/lghhuk/regtime.txt", buf, {
      gzip: true,
    });
    return;
  }
  let config;
  if (draft.pipe.json.isTest) {
    // 	if(false){
    config = {
      host: "sftpbizb12.tgms.gxs.com",
      port: "22",
      username: "ACD02635",
      password: "DU9RXFA6",
    };
  } else {
    config = {
      host: "sftpbizp12.tgms.gxs.com",
      port: "22",
      username: "AET42468",
      password: "ZFQECM40",
    };
  }

  // draft.response.body = {};
  let fullPath;
  let fileNameList;
  let invoiceID;
  draft.response.body.ftpResult = [];

  for (let idx = 0; idx < draft.pipe.json.InvoiceArr.length; idx++) {
    // savers와 asda가 아니면 내용이 없다.
    const invoice = draft.pipe.json.InvoiceArr[idx];
    if (!invoice) {
      continue;
    }
    const value = draft.pipe.json.InvoiceArr[idx].toString();
    const { client } = await ftp.connect(config);
    const today = new Date();

    const year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1; // 월
    let date = today.getDate(); // 날짜
    let hour = today.getHours(); // 시간
    let minute = today.getMinutes();
    let second = today.getSeconds();

    if (month < 10) {
      month = "0" + month.toString();
    }
    if (date < 10) {
      date = "0" + date.toString();
    }
    if (hour < 10) {
      hour = "0" + hour.toString();
    }
    if (minute < 10) {
      minute = "0" + minute.toString();
    }
    if (second < 10) {
      second = "0" + second.toString();
    }

    const time = hour.toString() + minute.toString() + second.toString();
    // GNL코드 13자리 고정
    const receiver = value.substr(value.indexOf("<ReceiverID>") + 12, 13);
    const docName = "inv";

    const fileName = `${docName}_${receiver}_${year}${month}${date}${time}.xml`;

    const remotePath = "/custom/TO_OpenText";
    fullPath = [remotePath, fileName].join("/");

    invoiceID = value.substr(
      value.indexOf("<InterchangeCtrlNbr>") + 20,
      value.indexOf("</InterchangeCtrlNbr>") -
        value.indexOf("<InterchangeCtrlNbr>") -
        20
    );

    try {
      await ftp.upload(client, value, fullPath);
      fileNameList = await ftp.list(client, remotePath);
      log(invoiceID + "uploaded");
      draft.response.body.ftpResult.push({
        path: fullPath,
        list: fileNameList.results[0].name,
        id: invoiceID,
        time: draft.pipe.json.toTime,
      });
    } catch (err) {
      const now = new Date().toISOString();
      log(invoiceID + "failedUpload:" + err.message);
      const buf = Buffer.from(invoiceID + "failedUpload", "utf8").toString();
      file.upload("/sftpUploadError/" + now, buf, { gzip: true });
    }

    await client.end();

    // 파일 이름에 시분초가 들어감. 초당 1건만 전송해야 함.
    setTimeout(() => console.log("timeout"), 1000);
  } // 인보이스 반복 끝
  // 스케줄이 작동한 시간을 기록해 두고 다음 스케줄 실행시 시작시간(fromTime)에 사용한다.
  const buf = Buffer.from(draft.pipe.json.toTime, "utf8").toString();
  await file.upload("/send/opentext/lghhuk/regtime.txt", buf, {
    gzip: true,
  });
};
