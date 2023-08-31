module.exports = async (draft, { log }) => {
  // restFul 요청
  const https = require("https");

  draft.response.body = [];

  // const postData = draft.pipe.json.material;
  const postData =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
    "<soap-env:Header>" +
    '<msgID:messageId xmlns:msgID=""http://www.sap.com/webas/640/soap/features/messageId/"">uuid:00163ec1-abf4-1eeb-acbf-25ab61ffa285</msgID:messageId>' +
    "</soap-env:Header>" +
    "<soap-env:Body>" +
    '<n0:OutboundDeliveryExecutionRequest xmlns:n0=""http://sap.com/xi/SAPGlobal20/Global"" xmlns:prx=""urn:sap.com:proxy:LVP:/1SAI/TASCF95E8D50E1E44B47D4E:804"">' +
    "<MessageHeader>" +
    "<ID>00163EC0BE851EDBB6C27C235FB1C04C</ID>" +
    "<CreationDateTime>2021-07-01T02:27:28.432139Z</CreationDateTime>" +
    "<SenderParty>" +
    '<InternalID schemeAgencyID=""_LOCAL_SYSTEM_ALIAS_SAP_INTERNAL_CONSTANT_VALUE_"" schemeID=""CommunicationPartyID"">LG_HNH_UK</InternalID>' +
    '<StandardID schemeAgencyID=""9"">5065004854016</StandardID>' +
    "</SenderParty>" +
    "<RecipientParty>" +
    '<InternalID schemeAgencyID=""_LOCAL_SYSTEM_ALIAS_SAP_INTERNAL_CONSTANT_VALUE_"" schemeID=""CommunicationPartyID"">PANTOS</InternalID>' +
    '<StandardID schemeAgencyID=""16"">687822338</StandardID>' +
    "</RecipientParty>" +
    "<BusinessScope>" +
    '<TypeCode listAgencyID=""310"" listID=""25201"">2</TypeCode>' +
    '<ID schemeAgencyID=""310"" schemeID=""10555"">367</ID>' +
    "</BusinessScope>" +
    "<BusinessScope>" +
    '<TypeCode listAgencyID=""310"" listID=""25201"">3</TypeCode>' +
    '<ID schemeAgencyID=""310"" schemeID=""10555"">36</ID>' +
    "</BusinessScope>" +
    "</MessageHeader>" +
    "<OutboundDeliveryExecution>" +
    "<ID>119</ID>" +
    "<TypeCode>1580</TypeCode>" +
    "<EmployeeResponsibleParty>" +
    "<InternalID>8000000014</InternalID>" +
    "<SellerID>8000000014</SellerID>" +
    "<VendorID>8000000014</VendorID>" +
    "<TypeCode>167</TypeCode>" +
    "<Address>" +
    '<DisplayName languageCode=""EN"">Neil Tanner</DisplayName>' +
    "<OrganisationFormattedName>Neil Tanner</OrganisationFormattedName>" +
    "</Address>" +
    "</EmployeeResponsibleParty>" +
    "<VendorParty>" +
    "<InternalID>LG_HNH_UK</InternalID>" +
    '<StandardID schemeAgencyID=""9"">5065004854016</StandardID>' +
    "<SellerID>LG_HNH_UK</SellerID>" +
    "<VendorID>LG_HNH_UK</VendorID>" +
    "<TypeCode>154</TypeCode>" +
    "<Address>" +
    '<DisplayName languageCode=""EN"">LG H&amp;H UK LTD</DisplayName>' +
    "<OrganisationFormattedName>LG H&amp;H UK LTD</OrganisationFormattedName>" +
    "<PhysicalAddress>" +
    "<CountryCode>GB</CountryCode>" +
    '<CountryName languageCode=""EN"">United Kingdom</CountryName>' +
    "<RegionCode>BU</RegionCode>" +
    "<RegionName>Buckinghamshire</RegionName>" +
    "<StreetPostalCode>MK9 1FH</StreetPostalCode>" +
    "<CityName>Milton Keynes</CityName>" +
    "<StreetName>100 Avebury Boulevard</StreetName>" +
    "</PhysicalAddress>" +
    "<Communication>" +
    "<Telephone>" +
    "<Number>" +
    "<SubscriberID>02072922205</SubscriberID>" +
    "<CountryCode>GB</CountryCode>" +
    "<CountryDiallingCode>+44</CountryDiallingCode>" +
    '<CountryName languageCode=""EN"">United Kingdom</CountryName>' +
    "</Number>" +
    "<NumberDefaultIndicator>true</NumberDefaultIndicator>" +
    "<NumberUsageDenialIndicator>false</NumberUsageDenialIndicator>" +
    "</Telephone>" +
    "<Email>" +
    "<URI>Bomikim@lghnh.co.uk</URI>" +
    "<URIDefaultIndicator>true</URIDefaultIndicator>" +
    "<URIUsageDenialIndicator>false</URIUsageDenialIndicator>" +
    "</Email>" +
    "</Communication>" +
    "</Address>" +
    "</VendorParty>" +
    "<ProductRecipientParty>" +
    "<InternalID>C3002</InternalID>" +
    "<SellerID>C3002</SellerID>" +
    "<VendorID>C3002</VendorID>" +
    "<TypeCode>147</TypeCode>" +
    "<Address>" +
    '<DisplayName languageCode=""EN"">BOOTS UK LIMITED</DisplayName>' +
    "<OrganisationFormattedName>BOOTS UK LIMITED</OrganisationFormattedName>" +
    "<PhysicalAddress>" +
    "<CountryCode>GB</CountryCode>" +
    '<CountryName languageCode=""EN"">United Kingdom</CountryName>' +
    "<StreetPostalCode>NG2 3AA</StreetPostalCode>" +
    "<CityName>Nottingham</CityName>" +
    "<StreetPrefixName>Nottingham</StreetPrefixName>" +
    "<StreetSuffixName>Nottinghamshire</StreetSuffixName>" +
    "</PhysicalAddress>" +
    "<Communication>" +
    "<CorrespondenceLanguageCode>EN</CorrespondenceLanguageCode>" +
    '<CorrespondenceLanguageName languageCode=""EN"">English</CorrespondenceLanguageName>' +
    "<Email>" +
    "<URI>Rebecca.01.Smith@boots.co.uk</URI>" +
    "<URIDefaultIndicator>true</URIDefaultIndicator>" +
    "<URIUsageDenialIndicator>false</URIUsageDenialIndicator>" +
    "</Email>" +
    "</Communication>" +
    "</Address>" +
    "</ProductRecipientParty>" +
    "<BuyerParty>" +
    "<InternalID>C3002</InternalID>" +
    "<SellerID>C3002</SellerID>" +
    "<VendorID>C3002</VendorID>" +
    "<TypeCode>159</TypeCode>" +
    "<Address>" +
    '<DisplayName languageCode=""EN"">BOOTS UK LIMITED</DisplayName>' +
    "<OrganisationFormattedName>BOOTS UK LIMITED</OrganisationFormattedName>" +
    "<PhysicalAddress>" +
    "<CountryCode>GB</CountryCode>" +
    '<CountryName languageCode=""EN"">United Kingdom</CountryName>' +
    "<StreetPostalCode>NG2 3AA</StreetPostalCode>" +
    "<CityName>Nottingham</CityName>" +
    "<StreetPrefixName>Nottingham</StreetPrefixName>" +
    "<StreetSuffixName>Nottinghamshire</StreetSuffixName>" +
    "</PhysicalAddress>" +
    "<Communication>" +
    "<CorrespondenceLanguageCode>EN</CorrespondenceLanguageCode>" +
    '<CorrespondenceLanguageName languageCode=""EN"">English</CorrespondenceLanguageName>' +
    "<Email>" +
    "<URI>Rebecca.01.Smith@boots.co.uk</URI>" +
    "<URIDefaultIndicator>true</URIDefaultIndicator>" +
    "<URIUsageDenialIndicator>false</URIUsageDenialIndicator>" +
    "</Email>" +
    "</Communication>" +
    "</Address>" +
    "</BuyerParty>" +
    "<SellerParty>" +
    "<InternalID>LG_HNH_UK</InternalID>" +
    '<StandardID schemeAgencyID=""9"">5065004854016</StandardID>' +
    "<SellerID>LG_HNH_UK</SellerID>" +
    "<VendorID>LG_HNH_UK</VendorID>" +
    "<TypeCode>154</TypeCode>" +
    "<Address>" +
    '<DisplayName languageCode=""EN"">LG H&amp;H UK LTD</DisplayName>' +
    "<OrganisationFormattedName>LG H&amp;H UK LTD</OrganisationFormattedName>" +
    "<PhysicalAddress>" +
    "<CountryCode>GB</CountryCode>" +
    '<CountryName languageCode=""EN"">United Kingdom</CountryName>' +
    "<RegionCode>BU</RegionCode>" +
    "<RegionName>Buckinghamshire</RegionName>" +
    "<StreetPostalCode>MK9 1FH</StreetPostalCode>" +
    "<CityName>Milton Keynes</CityName>" +
    "<StreetName>100 Avebury Boulevard</StreetName>" +
    "</PhysicalAddress>" +
    "<Communication>" +
    "<Telephone>" +
    "<Number>" +
    "<SubscriberID>02072922205</SubscriberID>" +
    "<CountryCode>GB</CountryCode>" +
    "<CountryDiallingCode>+44</CountryDiallingCode>" +
    '<CountryName languageCode=""EN"">United Kingdom</CountryName>' +
    "</Number>" +
    "<NumberDefaultIndicator>true</NumberDefaultIndicator>" +
    "<NumberUsageDenialIndicator>false</NumberUsageDenialIndicator>" +
    "</Telephone>" +
    "<Email>" +
    "<URI>Bomikim@lghnh.co.uk</URI>" +
    "<URIDefaultIndicator>true</URIDefaultIndicator>" +
    "<URIUsageDenialIndicator>false</URIUsageDenialIndicator>" +
    "</Email>" +
    "</Communication>" +
    "</Address>" +
    "</SellerParty>" +
    "<ShipFromLocation>" +
    "<InternalID>EXTERNAL_WAREHOUSE_1</InternalID>" +
    "<VendorID>EXTERNAL_WAREHOUSE_1</VendorID>" +
    "<Address>" +
    '<DisplayName languageCode=""EN"">Pantos</DisplayName>' +
    "<OrganisationFormattedName>Pantos</OrganisationFormattedName>" +
    "<OrganisationFormattedName>Pantos</OrganisationFormattedName>" +
    "<PhysicalAddress>" +
    "<CountryCode>GB</CountryCode>" +
    '<CountryName languageCode=""EN"">United Kingdom</CountryName>' +
    "<StreetPostalCode>CV3 4LB</StreetPostalCode>" +
    "<StreetPrefixName>Coventry Wheler Road</StreetPrefixName>" +
    "</PhysicalAddress>" +
    "</Address>" +
    "</ShipFromLocation>" +
    "<ShipToLocation>" +
    "<Address>" +
    '<DisplayName languageCode=""EN"">BOOTS UK LIMITED</DisplayName>' +
    "<OrganisationFormattedName>BOOTS UK LIMITED</OrganisationFormattedName>" +
    "<PhysicalAddress>" +
    "<CountryCode>GB</CountryCode>" +
    '<CountryName languageCode=""EN"">United Kingdom</CountryName>' +
    "<StreetPostalCode>NG2 3AA</StreetPostalCode>" +
    "<CityName>Nottingham</CityName>" +
    "<StreetPrefixName>Nottingham</StreetPrefixName>" +
    "<StreetSuffixName>Nottinghamshire</StreetSuffixName>" +
    "</PhysicalAddress>" +
    "<Communication>" +
    "<CorrespondenceLanguageCode>EN</CorrespondenceLanguageCode>" +
    '<CorrespondenceLanguageName languageCode=""EN"">English</CorrespondenceLanguageName>' +
    "<Email>" +
    "<URI>Rebecca.01.Smith@boots.co.uk</URI>" +
    "<URIDefaultIndicator>true</URIDefaultIndicator>" +
    "<URIUsageDenialIndicator>false</URIUsageDenialIndicator>" +
    "</Email>" +
    "</Communication>" +
    "</Address>" +
    "</ShipToLocation>" +
    "<ShippingDateTimePeriod>" +
    '<StartDateTime timeZoneCode=""UK"">2021-07-02T22:59:59Z</StartDateTime>' +
    '<EndDateTime timeZoneCode=""UK"">2021-07-02T22:59:59Z</EndDateTime>' +
    "</ShippingDateTimePeriod>" +
    "<ArrivalDateTimePeriod>" +
    '<StartDateTime timeZoneCode=""UK"">2021-07-02T23:00:00Z</StartDateTime>' +
    '<EndDateTime timeZoneCode=""UK"">2021-07-02T23:00:00Z</EndDateTime>' +
    "</ArrivalDateTimePeriod>" +
    "<DeliveryTerms>" +
    "<DeliveryPriorityCode>3</DeliveryPriorityCode>" +
    "</DeliveryTerms>" +
    "<SenderLastChangeDateTime>2021-07-01T02:27:27.00251Z</SenderLastChangeDateTime>" +
    "<Item>" +
    "<ID>10</ID>" +
    "<TypeCode>40</TypeCode>" +
    '<DeliveryQuantity unitCode=""EA"">1.0</DeliveryQuantity>' +
    "<DeliveryQuantityTypeCode>EA</DeliveryQuantityTypeCode>" +
    "<Product>" +
    "<InternalID>18230625</InternalID>" +
    '<StandardID schemeAgencyID=""9"">3574660483581</StandardID>' +
    "<SellerID>18230625</SellerID>" +
    "<VendorID>18230625</VendorID>" +
    "<TypeCode>1</TypeCode>" +
    "</Product>" +
    "<OriginPurchaseOrderReference>" +
    "<ID>23123112</ID>" +
    "<TypeCode>001</TypeCode>" +
    "</OriginPurchaseOrderReference>" +
    "<SalesOrderReference>" +
    "<ID>426</ID>" +
    "<TypeCode>114</TypeCode>" +
    "<ItemID>10</ItemID>" +
    "<ItemTypeCode>28</ItemTypeCode>" +
    "</SalesOrderReference>" +
    "<DeliveryTerms>" +
    "<PartialDeliveryControlCode>1</PartialDeliveryControlCode>" +
    "</DeliveryTerms>" +
    "</Item>" +
    "<Item>" +
    "<ID>20</ID>" +
    "<TypeCode>40</TypeCode>" +
    '<DeliveryQuantity unitCode=""XBX"">1.0</DeliveryQuantity>' +
    "<DeliveryQuantityTypeCode>XBX</DeliveryQuantityTypeCode>" +
    "<Product>" +
    "<InternalID>18230635</InternalID>" +
    '<StandardID schemeAgencyID=""9"">3574660575507</StandardID>' +
    "<SellerID>18230635</SellerID>" +
    "<VendorID>18230635</VendorID>" +
    "<TypeCode>1</TypeCode>" +
    "</Product>" +
    "<OriginPurchaseOrderReference>" +
    "<ID>23123112</ID>" +
    "<TypeCode>001</TypeCode>" +
    "</OriginPurchaseOrderReference>" +
    "<SalesOrderReference>" +
    "<ID>426</ID>" +
    "<TypeCode>114</TypeCode>" +
    "<ItemID>20</ItemID>" +
    "<ItemTypeCode>28</ItemTypeCode>" +
    "</SalesOrderReference>" +
    "<DeliveryTerms>" +
    "<PartialDeliveryControlCode>1</PartialDeliveryControlCode>" +
    "</DeliveryTerms>" +
    "</Item>" +
    "</OutboundDeliveryExecution>" +
    "</n0:OutboundDeliveryExecutionRequest>" +
    "</soap-env:Body>" +
    "</soap-env:Envelope>";

  // draft.response.body.push(postData);
  // draft.response.body.push(typeof(postData));  //string

  const username = "LGHH";
  const password = "LGHH";
  const idNpw = username + ":" + password;

  const options = {
    hostname: "b2bqa.lxpantos.com",
    port: 5409,
    path: "/invoke/wm.tn/receive",
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Content-Length": Buffer.byteLength(postData),
      Authorization:
        "Basic " +
        new Buffer.alloc(Buffer.byteLength(idNpw), idNpw).toString("base64"),
    },
  };

  function getPromise(opt) {
    return new Promise(function (resolve, reject) {
      const req = https.request(opt, function (res) {
        let body = "";

        res.on("data", function (d) {
          body += d.toString();
          draft.response.body.push(body);
        });

        res.on("end", function () {
          draft.response.body.push(body);
          resolve(body);
        });

        res.on("error", function (e) {
          draft.response.body.push(e);
          reject(e);
        });
      });
      // .end();  // .end() req.end() 둘다 가능
      req.on("error", (e) => {
        draft.response.body.push(e);
      });

      req.write(postData);
      req.end();
    });
  }

  async function req_call() {
    try {
      let http_promise = await getPromise(options);
      draft.response.body.push(http_promise.body);
      //성공 시 시간기록
      // const buf = Buffer.from(draft.pipe.json.fromtime, 'utf8').toString();
      //     file.upload('/send/material/pantos/regtime.txt', buf, {gzip:true});
    } catch (e) {
      draft.response.body.push(e);
    }
  }

  await req_call();
  draft.response.body.push(postData);
  log("end");
};
