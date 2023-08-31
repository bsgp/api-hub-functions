module.exports = async (draft, { sql, clone }) => {
  // 데이터 구조 마스터화
  const { tbOpr, tbDef, tbMap } = draft.json;
  const resBody = [];
  const query = sql("mysql");

  const getKey = (row, col) => [row, col].join("_");

  const initialOprList = [
    { cd_opr: "C1", txt_opr: "절삭" },
    { cd_opr: "C2", txt_opr: "단판" },
    { cd_opr: "C3", txt_opr: "중판" },
    { cd_opr: "C4", txt_opr: "접착" },
    { cd_opr: "C5", txt_opr: "열" },
    { cd_opr: "C6", txt_opr: "수지" },
    { cd_opr: "C7", txt_opr: "검사" },
  ];

  const initialDefList = [
    { cd_def: "C1-01", txt_def: "거친절삭", cd_opr: "C1" },
    { cd_def: "C1-02", txt_def: "칼자욱", cd_opr: "C1" },
    { cd_def: "C1-03", txt_def: "중판후박", cd_opr: "C1" },
    { cd_def: "C1-04", txt_def: "파상단판", cd_opr: "C1" },
    { cd_def: "C1-05", txt_def: "파상중판", cd_opr: "C1" },
    { cd_def: "C1-06", txt_def: "파상병판", cd_opr: "C1" },
    { cd_def: "C1-07", txt_def: "오염", cd_opr: "C1" },
    { cd_def: "C2-01", txt_def: "단판접침", cd_opr: "C2" },
    { cd_def: "C2-02", txt_def: "단판불량", cd_opr: "C2" },
    { cd_def: "C2-03", txt_def: "병판요철", cd_opr: "C2" },
    { cd_def: "C2-04", txt_def: "갈림", cd_opr: "C2" },
    { cd_def: "C2-05", txt_def: "만곡", cd_opr: "C2" },
    { cd_def: "C3-01", txt_def: "중판겹침", cd_opr: "C3" },
    { cd_def: "C3-02", txt_def: "두께불량", cd_opr: "C3" },
    { cd_def: "C3-03", txt_def: "중판요철", cd_opr: "C3" },
    { cd_def: "C4-01", txt_def: "목편", cd_opr: "C4" },
    { cd_def: "C4-02", txt_def: "단판겹침", cd_opr: "C4" },
    { cd_def: "C4-03", txt_def: "중판겹침", cd_opr: "C4" },
    { cd_def: "C4-04", txt_def: "단부길이", cd_opr: "C4" },
    { cd_def: "C4-05", txt_def: "단부머리", cd_opr: "C4" },
    { cd_def: "C4-06", txt_def: "중부길이", cd_opr: "C4" },
    { cd_def: "C4-07", txt_def: "중부머리", cd_opr: "C4" },
    { cd_def: "C4-08", txt_def: "병판부족", cd_opr: "C4" },
    { cd_def: "C4-09", txt_def: "벌림", cd_opr: "C4" },
    { cd_def: "C4-10", txt_def: "실자리", cd_opr: "C4" },
    { cd_def: "C5-01", txt_def: "파손", cd_opr: "C5" },
    { cd_def: "C5-02", txt_def: "눌림", cd_opr: "C5" },
    { cd_def: "C5-03", txt_def: "절단기", cd_opr: "C5" },
    { cd_def: "C6-01", txt_def: "접불가장", cd_opr: "C6" },
    { cd_def: "C6-02", txt_def: "접불수포", cd_opr: "C6" },
    { cd_def: "C6-04", txt_def: "냉압불량", cd_opr: "C6" },
    { cd_def: "C7-01", txt_def: "연삭기", cd_opr: "C7" },
    { cd_def: "C7-02", txt_def: "빠데", cd_opr: "C7" },
    { cd_def: "C7-03", txt_def: "파손", cd_opr: "C7" },
    { cd_def: "fqty", txt_def: "불량매수", cd_opr: "" },
    { cd_def: "tqty", txt_def: "검사총량", cd_opr: "" },
    { cd_def: "rate", txt_def: "불량율", cd_opr: "" },
  ];

  const initialRows = [
    { row_idx: 0, col_idx: 2, key_json: { field: "spec" } },
    { row_idx: 1, col_idx: 2, key_json: { field: "product" } },
    {
      row_idx: 3,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C1-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 3,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C1-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 3,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C1-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 3,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C1-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 4,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C1-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 4,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C1-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 4,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C1-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 4,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C1-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 5,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C1-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 5,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C1-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 5,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C1-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 5,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C1-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 6,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C1-04",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 6,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C1-04",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 6,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C1-04",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 6,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C1-04",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 7,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C1-05",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 7,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C1-05",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 7,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C1-05",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 7,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C1-05",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 8,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C1-06",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 8,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C1-06",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 8,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C1-06",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 8,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C1-06",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 9,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C1-07",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 9,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C1-07",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 9,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C1-07",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 9,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C1-07",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 10,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C2-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 10,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C2-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 10,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C2-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 10,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C2-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 11,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C2-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 11,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C2-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 11,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C2-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 11,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C2-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 12,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C2-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 12,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C2-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 12,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C2-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 12,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C2-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 13,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C2-04",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 13,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C2-04",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 13,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C2-04",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 13,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C2-04",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 14,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C2-05",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 14,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C2-05",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 14,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C2-05",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 14,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C2-05",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 15,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C3-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 15,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C3-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 15,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C3-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 15,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C3-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 16,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C3-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 16,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C3-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 16,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C3-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 16,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C3-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 17,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C3-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 17,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C3-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 17,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C3-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 17,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C3-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 20,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C4-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 20,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C4-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 20,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C4-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 20,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C4-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 21,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C4-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 21,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C4-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 21,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C4-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 21,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C4-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 22,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C4-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 22,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C4-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 22,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C4-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 22,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C4-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 23,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C4-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 23,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C4-04",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 23,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C4-04",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 23,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C4-04",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 24,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C4-05",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 24,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C4-05",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 24,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C4-05",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 24,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C4-05",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 25,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C4-06",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 25,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C4-06",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 25,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C4-06",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 25,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C4-06",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 26,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C4-07",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 26,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C4-07",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 26,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C4-07",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 26,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C4-07",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 27,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C4-08",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 27,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C4-08",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 27,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C4-08",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 27,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C4-08",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 28,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C4-09",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 28,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C4-09",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 28,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C4-09",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 28,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C4-09",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 29,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C4-10",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 29,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C4-10",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 29,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C4-10",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 29,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C4-10",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 30,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C5-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 30,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C5-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 30,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C5-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 30,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C5-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 31,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C5-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 31,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C5-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 31,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C5-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 31,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C5-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 32,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C5-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 32,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C5-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 32,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C5-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 32,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C5-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 33,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C6-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 33,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C6-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 33,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C6-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 33,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C6-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 34,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C6-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 34,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C6-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 34,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C6-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 34,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C6-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 35,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C6-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 35,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C6-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 35,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C6-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 35,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C6-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 36,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C7-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 36,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C7-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 36,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C7-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 36,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C7-01",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 37,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C7-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 37,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C7-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 37,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C7-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 37,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C7-02",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 38,
      col_idx: 2,
      key_json: {
        team: "A",
        machine: "GS3호",
        cd_def: "C7-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 38,
      col_idx: 3,
      key_json: {
        team: "B",
        machine: "GS3호",
        cd_def: "C7-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 38,
      col_idx: 4,
      key_json: {
        team: "A",
        machine: "GS4호",
        cd_def: "C7-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 38,
      col_idx: 5,
      key_json: {
        team: "B",
        machine: "GS4호",
        cd_def: "C7-03",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 39,
      col_idx: 1,
      key_json: {
        team: "",
        machine: "",
        cd_def: "fqty",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 40,
      col_idx: 1,
      key_json: {
        team: "",
        machine: "",
        cd_def: "tqty",
        spec: "0_2",
        product: "1_2",
      },
    },
    {
      row_idx: 41,
      col_idx: 1,
      key_json: {
        team: "",
        machine: "",
        cd_def: "rate",
        spec: "0_2",
        product: "1_2",
      },
    },
  ].reduce((acc, each) => {
    for (let idx = 0; idx < 3; idx += 1) {
      const newEach = clone(each);

      if (idx === 0) {
        // pass
      } else {
        if (newEach.key_json.field) {
          newEach.col_idx += idx;
        } else if (["fqty", "tqty", "rate"].includes(newEach.key_json.cd_def)) {
          newEach.col_idx += idx;
        } else {
          newEach.col_idx += 5 * idx;
        }

        if (newEach.key_json.spec) {
          const [oldRow, oldCol] = newEach.key_json.spec.split("_");
          newEach.key_json.spec = getKey(oldRow, parseInt(oldCol) + idx);
        }

        if (newEach.key_json.product) {
          const [oldRow, oldCol] = newEach.key_json.product.split("_");
          newEach.key_json.product = getKey(oldRow, parseInt(oldCol) + idx);
        }
      }

      newEach.key_json = JSON.stringify(newEach.key_json);

      acc.push(newEach);
    }
    return acc;
  }, []);

  // const mapJoinDef = initialRows.map((each) => {
  //   let result;
  //   if (each.key_json.cd_def) {
  //     result = initialDefList.reduce((acc, cur) => {
  //       if (cur.cd_def === each.key_json.cd_def) {
  //         acc = cur;
  //       }
  //       return acc;
  //     }, "");
  //     each.key_json = Object.assign(each.key_json, result);
  //   }

  //   return each;
  // });

  // const mapJoinDefJoinOpr = mapJoinDef.map((each) => {
  //   let result;
  //   if (each.key_json.cd_opr) {
  //     result = initialOprList.reduce((acc, cur) => {
  //       if (cur.cd_opr === each.key_json.cd_opr) {
  //         acc = cur;
  //       }
  //       return acc;
  //     }, "");
  //   }
  //   each.key_json = Object.assign(each.key_json, result);
  //   return each;
  // });

  // const JSONinitialRows = mapJoinDefJoinOpr.map((cur) => {
  //   cur.key_json = JSON.stringify(cur.key_json);
  //   return cur;
  // });

  try {
    const def_result = await query
      .insert(tbDef, initialDefList)
      .onConflict("cd_def")
      .merge()
      .run();

    const opr_result = await query
      .insert(tbOpr, initialOprList)
      .onConflict("cd_opr")
      .merge()
      .run();

    const mapping_result = await query
      .insert(tbMap, initialRows)
      .onConflict(["row_idx", "col_idx"])
      .merge()
      .run();

    resBody.push(
      "Function#6 NOT err",
      "def_result",
      def_result,
      "opr_result",
      opr_result,
      "mapping_result",
      mapping_result
    );
  } catch (err) {
    resBody.push(err);
  }

  draft.response.body = resBody;
};
