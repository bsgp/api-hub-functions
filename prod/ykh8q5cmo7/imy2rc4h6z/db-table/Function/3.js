module.exports = async (draft, { file, log }) => {
  const tables = {
    gdeleted: {
      name: "GROUP_DEL_1",
      desc: "삭제된 그룹",
      unique: ['GROUP_ID', 'DELETE_DATE']
    },
    gfile: {
      name: "GROUP_FILE_1",
      desc: "그룹 할당 파일",
      unique: ['NAME', 'GROUP_ID', 'USER_ID']
    },
    gheader: {
      name: "GROUP_HD_1",
      desc: "그룹 목록",
      unique: ['ID']
    },
    gitem: {
      name: "GROUP_ITEM_1",
      desc: "그룹 할당 작업",
      unique: ['JOB_ID', 'USER_ID']
    },
    gmember: {
      name: "GROUP_MEM_1",
      desc: "그룹 할당 멤버",
      unique: ['GROUP_ID', 'USER_ID']
    },
    gmeta: {
      name: "GROUP_META_1",
      desc: "입력된 메타",
      unique: ['GROUP_ID', 'META_ID']
    },
    jheader: {
      name: "JOB_HD_5",
      desc: "작업 상세",
      unique: ['JOB_ID', 'USER_ID']
      
    },
    mheader: {
      name: "META_HD_2",
      desc: "메타 항목",
      unique: ['ID']
    },
    mitem: {
      name: "META_ITEM_1",
      desc: "메타 선택 목록",
      unique: ['MD_ID', 'CODE']
    },
    mrelation: {
      name: "META_REL_1",
      desc: "메타 카테고리",
      unique: ['ID', 'REL_ID']
    },
    mtype: {
      name: "META_TYPE_1",
      desc: "메타 입력 방식",
      unique: ['ID']
    }
  };

  const result = await file.upload("config/tables.json", tables, {
    gzip: true
  });
  log("upload tables config:", result);

  draft.pipe.json.tables = tables;
};