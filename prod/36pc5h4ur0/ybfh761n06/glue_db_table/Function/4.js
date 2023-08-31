module.exports = async (draft, { request }) => {
  draft.json.tbName = request.body.TbName.toLowerCase();
  if (request.body.PerSys === true) {
    draft.json.tbName = [draft.json.tbName, "per_sys"].join("_");
  }

  switch (request.body.TbName) {
    case "record":
    case "coact":
    case "unit":
    case "item":
    case "engagement_rate":
    case "records_w_coacts":
      {
        draft.json.dbName = ["impactus", request.stage].join("_");
      }
      break;
    case "system":
    case "user":
      {
        draft.json.dbName = ["identities_v2", request.stage].join("_");
      }
      break;
    default:
      break;
  }

  switch (request.body.TbName) {
    case "record":
      {
        draft.json.columns = [
          "pkid",
          "skid",
          "category",
          "convos",
          "createdAt",
          "updatedAt",
          "items",
          "status",
          "sid",
          "uid",
          "id",
          "unitId",
        ];
      }
      break;
    case "coact":
      {
        draft.json.columns = [
          "pkid",
          "skid",
          "createdat",
          "updatedat",
          "addresstext",
          "assigneeid",
          "assigneetext",
          "assigneetype",
          "category",
          "corractiontext",
          "images",
          "itemid",
          "likers",
          "rastatus",
          "reasontext",
          "recid",
          "recstatus",
          "safety",
          "sid",
          "pid",
          "situationtext",
          "status",
          "uid",
          "unitid",
          "wantra",
          "id",
        ];
      }
      break;
    case "unit":
      {
        draft.json.columns = [
          "pkid",
          "skid",
          "createdat",
          "updatedat",
          "category",
          "id",
          "name",
          request.body.PerSys === true ? "" : "sid",
          "users",
          "status",
          "validfrom",
          "validto",
        ].filter(Boolean);
      }
      break;
    case "item":
      {
        draft.json.columns = [
          "pkid",
          "skid",
          "createdat",
          "updatedat",
          "unitid",
          "id",
          "conditions",
          "description",
          "indicator1",
          "sid",
          "indicator2",
          "indicator3",
          "name",
          "questions",
          "type",
          {
            name: "seq",
            type: "int",
          },
        ];
      }
      break;
    case "system":
      {
        draft.json.columns = [
          "pkid",
          "skid",
          "createdat",
          "updatedat",
          "name",
          "pid",
          "sid",
          "versions",
        ].filter(Boolean);
      }
      break;
    case "user":
      {
        draft.json.columns = [
          "pkid",
          "skid",
          "createdat",
          "updatedat",
          "email",
          "groups",
          "lastactivatedat",
          "lastsigninat",
          "name",
          "tag",
          "pid",
          request.body.PerSys === true ? "" : "sid",
          "uid",
        ].filter(Boolean);
      }
      break;
    case "engagement_rate":
      {
        draft.json.statement = [
          "create or replace view engagement_rate as",
          "WITH units as (",
          "select",
          "sid,",
          "cardinality(array_distinct(flatten(ARRAY_AGG(",
          "cast(json_parse(users) as Array(json))",
          ")))) as allocated_users",
          "from impactus_prod.unit",
          "group by sid",
          "), records as (",
          "select",
          "sid,",
          "cardinality(array_distinct(ARRAY_AGG(uid))) as engaged_users",
          "from impactus_prod.record",
          "group by sid",
          ")",
          "select",
          "system.sid, system.name,",
          "units.allocated_users, records.engaged_users",
          "from identities_v2_prod.system as system",
          "join units ON units.sid = system.sid",
          "join records ON records.sid = system.sid",
        ].join(" ");
      }
      break;

    case "records_w_coacts":
      {
        draft.json.statement = [
          "create or replace view records_w_coacts as",
          "select record.*,",
          "user.skid as user_skid,",
          "user.createdAt as user_createdAt,",
          "user.updatedAt as user_updatedAt,",
          "user.email as user_email,",
          "user.groups as user_groups,",
          "user.lastSignInAt as user_lastSignInAt,",
          "user.name as user_name,",
          "user.sid as user_sid, user.uid as user_uid,",
          "coact.skid as coact_skid, coact.createdAt as coact_createdAt,",
          "coact.updatedAt as coact_updatedAt,",
          "coact.addressText as coact_addressText,",
          "coact.assigneeId as coact_assigneeId,",
          "coact.assigneeText as coact_assigneeText,",
          "coact.assigneeType as coact_assigneeType,",
          "coact.category as coact_category,",
          "coact.corrActionText as coact_corrActionText,",
          "coact.images as coact_images,",
          "coact.itemId as coact_itemId, coact.likers as coact_likers,",
          "coact.raStatus as coact_raStatus,",
          "coact.reasonText as coact_reasonText,",
          "coact.recId as coact_recId, coact.safety as coact_safety,",
          "coact.sid as coact_sid,",
          "coact.situationText as coact_situationText,",
          "coact.status as coact_status,",
          "coact.uid as coact_uid, coact.unitId as coact_unitId,",
          "coact.wantRa as coact_wantRa, coact.id as coact_id,",
          "coalesce((select",
          "cardinality(array_distinct(flatten(ARRAY_AGG(",
          "cast(json_parse(users) as Array(json))",
          "))))",
          "from impactus_prod.unit",
          "where sid = record.sid",
          "and date_format(date_parse(validFrom, '%Y-%m-%dT%H:%i:%sZ'",
          ") + interval '9' hour, '%Y/%m') <= date_format(",
          "date_parse(record.createdAt, '%Y-%m-%dT%H:%i:%s.%fZ'",
          ") + interval '9' hour, '%Y/%m')",
          "and date_format(date_parse(validTo, '%Y-%m-%dT%H:%i:%sZ'",
          ") + interval '9' hour, '%Y/%m') >= date_format(",
          "date_parse(record.createdAt, '%Y-%m-%dT%H:%i:%s.%fZ'",
          ") + interval '9' hour, '%Y/%m')",
          "), 0) as allocated_users,",
          "unit.skid as unit_skid, unit.createdAt as unit_createdAt,",
          "unit.updatedAt as unit_updatedAt,",
          "unit.category as unit_category,",
          "unit.id as unit_id, unit.name as unit_name,",
          "unit.sid as unit_sid,",
          "unit.users as unit_users, unit.status as unit_status,",
          "unit.validFrom as unit_validFrom,",
          "unit.validTo as unit_validTo",
          "from impactus_prod.record as record",
          "left outer join identities_v2_prod.user as user",
          "on user.sid = record.sid and user.uid = record.uid",
          "left outer join impactus_prod.unit as unit",
          "on unit.sid = record.sid and unit.id = record.unitId",
          "left outer join impactus_prod.coact as coact",
          "on coact.sid = record.sid and coact.recid = record.id",
        ].join(" ");
      }
      break;

    default:
      break;
  }

  switch (request.body.TbName) {
    case "record":
    case "coact":
      {
        draft.json.partitions = [{ name: `dt`, type: "string" }];
        draft.json.partitionKey = "dt";
      }
      break;
    default:
      break;
  }
  if (request.body.PerSys === true) {
    draft.json.partitions = [{ name: `sid`, type: "string" }];
    draft.json.partitionKey = "sid";
    draft.json.projectionType = "injected";
  }

  switch (request.body.TbName) {
    case "record":
    case "coact":
      {
        draft.json.s3Prefix = [
          "stream",
          draft.json.dbName,
          request.body.TbName.toUpperCase(),
        ].join("/");
      }
      break;
    case "unit":
    case "item":
      {
        draft.json.s3Prefix = [
          "stream",
          draft.json.dbName,
          request.body.TbName.toUpperCase(),
          "SYS",
        ].join("/");
      }
      break;
    case "system":
      {
        draft.json.s3Prefix = [
          "identities_v2",
          request.stage,
          "PID/36pc5h4ur0",
          request.body.TbName.toLowerCase(),
          "SID",
        ].join("/");
      }
      break;
    case "user":
      {
        draft.json.s3Prefix = [
          "identities_v2",
          request.stage,
          "PID/36pc5h4ur0",
          request.body.TbName.toLowerCase(),
          "SID/UID",
        ].join("/");
      }
      break;
    default:
      break;
  }

  switch (request.body.TbName) {
    case "records_w_coacts":
    case "engagement_rate":
      {
        draft.json.nextNodeKey = "Function#5";
      }
      break;
    default:
      {
        draft.json.nextNodeKey = "Function#3";
      }
      break;
  }
};
