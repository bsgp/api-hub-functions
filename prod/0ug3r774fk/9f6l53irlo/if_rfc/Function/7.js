module.exports = async (draft) => {
  const EQUIIPMENT_FIELD_LIST = [
    // { id: "WERKS", text: "공장", EQTYP: "SACF" },
    { id: "EQUNR", text: "설비번호", EQTYP: "SACFI" },
    { id: "EQTYP", text: "설비범주", EQTYP: "SACFI" },
    { id: "EQKTX", text: "설비내역", EQTYP: "SACFI" },
    { id: "HEQUI", text: "상위설비번호", EQTYP: "SACFI" },
    { id: "HEQKTX", text: "상위설비내역", EQTYP: "SACFI" },
    { id: "ARBPL", text: "설비 작업장", EQTYP: "SACFI" },
    { id: "KTEXT", text: "설비 작업장 내역", EQTYP: "SACFI" },
    { id: "IFLOT", text: "기능위치", EQTYP: "SACFI" },
    { id: "PLTXT", text: "기능위치 내역", EQTYP: "SACFI" },
    { id: "ZSPEC1", text: "공정코드", EQTYP: "SACF" },
    { id: "ZSPEC2", text: "공정명 ", EQTYP: "SACF" },
    { id: "ZSPEC3", text: "사용목적" },
    { id: "ZSPEC4", text: "컴퓨터 시스템", EQTYP: "S" },
    { id: "ZSPEC5", text: "제작사" },
    { id: "ZSPEC6", text: "모델명" },
    { id: "ZSPEC7", text: "고유번호", EQTYP: "SACF" },
    { id: "ZSPEC8", text: "교정대상", EQTYP: "SACF" },
    { id: "ZSPEC9", text: "설비중요도-안전(S)", EQTYP: "S" },
    { id: "ZSPEC10", text: "설비중요도-환경(E)", EQTYP: "S" },
    { id: "ZSPEC11", text: "설비중요도-품질(Q)", EQTYP: "S" },
    { id: "ZSPEC12", text: "설비중요도-생산(O)", EQTYP: "S" },
    { id: "ZSPEC13", text: "GMP 영향", EQTYP: "S" },
    { id: "ZSPEC14", text: "설비 설치일", EQTYP: "SACF" },
    { id: "ZSPEC15", text: "보증만료기간", EQTYP: "SACF" },
    { id: "ZSPEC16", text: "자산 취득가", EQTYP: "SACF" },
    { id: "ZSPEC17", text: "자산 취득가 단위", EQTYP: "S" },
    { id: "ZSPEC18", text: "법정검사 1", EQTYP: "SACF" },
    { id: "ZSPEC19", text: "법정검사 2", EQTYP: "SACF" },
    { id: "ZSPEC20", text: "용량", EQTYP: "SACF" },
    { id: "ZSPEC21", text: "적격성평가 대상", EQTYP: "S" },
    { id: "ZSPEC22", text: "수리순환품 유무", EQTYP: "SACF" },
    { id: "ZSPEC23", text: "취득가격 ", EQTYP: "SACF" },
    { id: "ZSPEC24", text: "취득가격 단위", EQTYP: "S" },
    { id: "ZSPEC32", text: "측정범위", EQTYP: "I" },
    { id: "ZSPEC33", text: "정확도", EQTYP: "I" },
    { id: "ZSPEC34", text: "분해능", EQTYP: "I" },
    { id: "ZSPEC35", text: "사용범위", EQTYP: "I" },
    { id: "ZSPEC36", text: "교정범위", EQTYP: "I" },
    { id: "ZSPEC37", text: "보정기준", EQTYP: "I" },
    { id: "ZSPEC38", text: "허용기준", EQTYP: "I" },
    { id: "ZSPEC39", text: "설비중요도", EQTYP: "I" },
    { id: "ZSPEC25", text: "Room 번호" },
    { id: "ZSPEC28", text: "설비운영부서" },
    { id: "ZSPEC31", text: "기존 계측기기번호", EQTYP: "I" },
    { id: "ZSPEC26", text: "기존 설비코드번호" },
    { id: "ZSPEC27", text: "기존 설비 국문명", EQTYP: "SACF" },
    { id: "ZSPEC30", text: "영문설비명", EQTYP: "S" },
    { id: "ZSPEC40", text: "System Complexity", EQTYP: "S" },
    { id: "ZSPEC41", text: "GAMP Category", EQTYP: "S" },
    { id: "ZSPEC42", text: "Computer System Level", EQTYP: "S" },
    { id: "ZSPEC43", text: "ER&ES Assessment", EQTYP: "S" },
    { id: "ZSPEC29", text: "작성자", EQTYP: "SACF" },
  ];

  draft.json.EQUIIPMENT_FIELD_LIST = EQUIIPMENT_FIELD_LIST;
};
