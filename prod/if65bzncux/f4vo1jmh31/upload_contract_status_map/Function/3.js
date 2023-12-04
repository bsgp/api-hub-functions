module.exports = async (draft, { file, env }) => {
  const statusMap = {
    // RQN: {
    //   name: "사업부 기안 상신",
    //   next: "APN",
    //   editable: false,
    // },
    APN: {
      name: "사업부 기안 승인완료",
      next: "DRN",
      editable: true,
    },
    DRN: {
      name: "신규계약작성중",
      next: "DRD",
      editable: true,
      approval: true,
    },
    DRD: {
      name: "신규계약작성완료",
      next: "DRD",
      editable: false,
      rewrite_S: true,
    },
    LRN: {
      name: "FnA 내부기안 상신",
      next: "LRC",
      editable: false,
    },
    LRR: {
      name: "FnA 내부기안 반려",
      next: "MOD",
      editable: true,
    },
    LRC: {
      name: "FnA 내부기안 승인완료",
      next: ["END", "ENC", "ECC", "TCC", "CDN"],
      editable: false,
    },
    ENC: {
      name: "전자(신규)계약 생성완료",
      next: "RSC",
      editable: false,
    },
    RSC: {
      name: "서명요청발송 완료",
      next: ["OSR", "OSC"],
      editable: false,
    },
    OSC: {
      name: "상대방 서명 완료",
      next: "SSC",
      editable: false,
    },
    SSC: {
      name: "서명 완료",
      next: "END",
      editable: false,
      rewrite_P: true,
    },
    OSR: {
      name: "상대방 서명 거부(반려)",
      next: "MOD",
      editable: true,
    },
    ECC: {
      name: "전자(변경)계약 생성완료",
      next: "RSC",
      editable: false,
    },
    TCC: {
      name: "계약해지를 위한 전자(변경)계약 생성완료",
      next: "RSC",
      editable: false,
    },
    TRM: {
      name: "폐기됨",
      next: "LRN",
      editable: false,
      approval: true,
    },
    CDN: {
      name: "변경계약작성중",
      next: "CDD",
      editable: true,
      approval: true,
    },
    CDD: {
      name: "변경계약작성완료",
      next: "CDD",
      editable: false,
      rewrite_S: true,
    },
    MOD: {
      name: "수정중",
      next: "LRN",
      editable: true,
      approval: true,
    },
    CNL: {
      name: "해지됨",
      editable: false,
      approval: true,
    },
  };

  await file.upload("config/contract_status.json", statusMap, {
    gzip: true,
    stage: env.CURRENT_ALIAS,
  });
  const url = await file.getUrl("config/contract_status.json", {
    stage: env.CURRENT_ALIAS,
  });

  draft.response.body = {
    url,
    count: Object.keys(statusMap).length,
    list: statusMap,
  };
};
