module.exports = async (draft) => {
  const plant = draft.pipe.json.plant;
  draft.response.body.plant = plant;

  const plantCode = draft.response.body.conversion.PLANT;

  const plantData = plant.body.result.ET_PLANT_DATA.find(
    (data) => data.PLANT === plantCode
  );
  const fAddress = plant.body.result.ET_PLANT_ADDRESS.find(
    (address) => address.ADDRNUMBER === plantData.ADDRNUMBER
  );
  const plantAddress = [
    fAddress.MC_CITY1,
    fAddress.MC_STREET,
    `\n${fAddress.MC_NAME1}`,
    `\n(${fAddress.POST_CODE1}, ${fAddress.COUNTRY})`,
  ].join(" ");
  const PLANT_TEXT = fAddress.NAME1;
  draft.response.body.conversion.SHIP_TO = plantAddress;
  draft.response.body.conversion.PLANT_TEXT = PLANT_TEXT;
  draft.response.body.conversion.ITEMS =
    draft.response.body.conversion.ITEMS.map((item) => ({
      ...item,
      PLANT_TEXT,
    }));
};
