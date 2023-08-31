module.exports = async (draft, { ftp }) => {
	const config = {
      host: 'sftpbizb12.tgms.gxs.com',
      port: '22',
      username: 'ACD02635',
      password: 'DU9RXFA6',
    };
    await ftp.connect(config);
    
    const xml = '<?xml version="1.0" encoding="UTF-8"?>'
+'<SAPINVOIC>'
+'	<TRANSMISSION>'
+'		<SenderID>5065004854016</SenderID>'
+'		<SenderNM>LGHH</SenderNM>'
+'		<ReceiverID>5013546119636</ReceiverID>'
+'		<ReceiverNM>SAVERS</ReceiverNM>'
+'		<TransDate>210426</TransDate>'
+'		<InterchangeCtrlNbr>50</InterchangeCtrlNbr>'
+'		<PriorityCd>B</PriorityCd>'
+'	</TRANSMISSION>'
+'	<FILE_HEADER>'
+'		<SupplierID>5065004854016</SupplierID>'
+'		<SupplierName>LGHH</SupplierName>'
+'		<CustomerID>5013546119636</CustomerID>'
+'		<CustomerName>SAVERS UK</CustomerName>'
+'		<CustomerAddr1>UNIT 1, PROLOGIS PARK</CustomerAddr1>'
+'		<CustomerAddr2>ARENSON WAY</CustomerAddr2>'
+'		<CustomerAddr3>DUNSTABLE</CustomerAddr3>'
+'		<CustomerPostCd>LU5 4RZ</CustomerPostCd>'
+'		<FileGenNbr>13</FileGenNbr>'
+'		<FileVerNbr>1</FileVerNbr>'
+'		<FileCreateDate>210426</FileCreateDate>'
+'	</FILE_HEADER>'
+'	<MSG_GROUP>'
+'		<MSG_HEADER>'
+'			<CustomerID>5060108745703</CustomerID>'
+'			<CustomerOwnCd>9818</CustomerOwnCd>'
+'			<CustomerName>DUNSTABLE-SAVERS</CustomerName>'
+'			<CustomerAddr1>UNIT 1, PROLOGIS PARK</CustomerAddr1>'
+'			<CustomerAddr2>ARENSON WAY</CustomerAddr2>'
+'			<CustomerAddr3>DUNSTABLE</CustomerAddr3>'
+'			<CustomerAddr4>BEDFORDSHIRE</CustomerAddr4>'
+'			<CustomerPostCd>LU5 4RZ</CustomerPostCd>'
+'			<InvoiceNbr>CIV-13</InvoiceNbr>'
+'			<InvoiceDate>210426</InvoiceDate>'
+'			<TaxPntDate>210426</TaxPntDate>'
+'		</MSG_HEADER>'
+'		<MSG_REF_GROUP>'
+'			<MSG_REFERENCE>'
+'				<CustomerOrderNbr>123456789016</CustomerOrderNbr>'
+'				<DelvNoteNbr>819</DelvNoteNbr>'
+'			</MSG_REFERENCE>'
+'			<MSG_DETAIL>'
+'				<ItemSeqNbr>1</ItemSeqNbr>'
+'				<EANCodeTraded>1234567890123</EANCodeTraded>'
+'				<EANCodeConsumer>1234567890123</EANCodeConsumer>'
+'				<QtyInPack>5</QtyInPack>'
+'				<QtyInvoiced>10</QtyInvoiced>'
+'				<UnitPrice>20000000</UnitPrice>'
+'				<ItemAmount>200000000</ItemAmount>'
+'				<VATRateCd>S</VATRateCd>'
+'				<VATRatePct>20000</VATRatePct>'
+'			</MSG_DETAIL>'
+'			<MSG_DETAIL>'
+'				<ItemSeqNbr>2</ItemSeqNbr>'
+'				<EANCodeTraded>1234567890235</EANCodeTraded>'
+'				<EANCodeConsumer>1234567890456</EANCodeConsumer>'
+'				<QtyInPack>5</QtyInPack>'
+'				<QtyInvoiced>20</QtyInvoiced>'
+'				<UnitPrice>60000000</UnitPrice>'
+'				<ItemAmount>1200000000</ItemAmount>'
+'				<VATRateCd>S</VATRateCd>'
+'				<VATRatePct>20000</VATRatePct>'
+'			</MSG_DETAIL>'
+'		</MSG_REF_GROUP>'
+'		<MSG_SUB-TRAILER>'
+'			<VATRateCd>S</VATRateCd>'
+'			<VATRatePct>20000</VATRatePct>'
+'			<ItemCount>2</ItemCount>'
+'			<SubTotItemAmount_LVLA>140000000</SubTotItemAmount_LVLA>'
+'			<ExtSubTotItemAmount_EVLA>140000000</ExtSubTotItemAmount_EVLA>'
+'			<ExtSubTotAmountIncDisc_ASDA>140000000</ExtSubTotAmountIncDisc_ASDA>'
+'			<VATAmt_VATA>28000000</VATAmt_VATA>'
+'			<PayableSubTotAmtExcDisc_APSE/>'
+'			<PayableSubTotAmtIncDisc_APSI>168000000</PayableSubTotAmtIncDisc_APSI>'
+'		</MSG_SUB-TRAILER>'
+'		<MSG_TRAILER>'
+'			<CntSubTrailer>1</CntSubTrailer>'
+'			<SumSubTotItemAmount_LVLT>140000000</SumSubTotItemAmount_LVLT>'
+'			<SumExtSubTotItemAmount_EVLT>140000000</SumExtSubTotItemAmount_EVLT>'
+'			<SumExtSubTotAmountIncDisc_ASDT>140000000</SumExtSubTotAmountIncDisc_ASDT>'
+'			<SumVATAmt_TVAT>28000000</SumVATAmt_TVAT>'
+'			<Sum_PayableSubTotAmtIncDisc_TPSI>168000000</Sum_PayableSubTotAmtIncDisc_TPSI>'
+'		</MSG_TRAILER>'
+'	</MSG_GROUP>'
+'	<MSG_VAT_TRAILER>'
+'		<VATRateCd>S</VATRateCd>'
+'		<VATRatePct>20000</VATRatePct>'
+'		<FileExtSubTotItemAmount_VSDE>140000000</FileExtSubTotItemAmount_VSDE>'
+'		<FileExtSubTotAmountIncDisc_VSDI>140000000</FileExtSubTotAmountIncDisc_VSDI>'
+'		<FileVATAmt_VVAT>28000000</FileVATAmt_VVAT>'
+'		<FilePayableSubTotAmtIncDisc_VPSI>168000000</FilePayableSubTotAmtIncDisc_VPSI>'
+'	</MSG_VAT_TRAILER>'
+'	<FILE_TRAILER>'
+'		<TotExtSubTotItemAmount_FASE>140000000</TotExtSubTotItemAmount_FASE>'
+'		<TotExtSubTotAmountIncDisc_FASI>140000000</TotExtSubTotAmountIncDisc_FASI>'
+'		<TotVATAmt_FVAT>28000000</TotVATAmt_FVAT>'
+'		<TotPayableSubTotAmtIncDisc_FPSI>168000000</TotPayableSubTotAmtIncDisc_FPSI>'
+'		<TotInvoicDetail>1</TotInvoicDetail>'
+'	</FILE_TRAILER>'
+'</SAPINVOIC>';


//파일 네이밍용 변수
let today = new Date();   
let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1;  // 월
let date = today.getDate();  // 날짜
let hour = today.getHours(); // 시간
let minute = today.getMinutes(); //분

if (month <10){ month = '0'+ month.toString();} //월 자릿 수 2자리
if (date <10){ date = '0'+ date.toString();} //일 자릿 수 2자리
if (hour <10){ hour = '0'+ hour.toString();} //시간 자릿 수 2자리
if (minute <10){ minute = '0'+ minute.toString();} //분 자릿 수 2자리

let time = hour.toString() + minute.toString(); 
let tpGLN = '5013546119636'; //savers 사의 gln 번호. //테스트 용으로 고정값 입력. 향후 customer master에서 가져와야 함.
let docName = 'inv'; //문서 종류명. 고정값.

let fileName = docName+'_'+tpGLN+'_'+year+month+date+time+'.'+'xml';

    const remotePath = "/custom/TO_OpenText";
    const fullPath = [remotePath,fileName].join("/");
    await ftp.upload(xml, fullPath);
    const isExisting = await ftp.exists(fullPath);
    
    const list = await ftp.list(remotePath);
    // .then(()=>{
    // return ftp.exists(fullPath);
    // });
        draft.response.body = {path: fullPath, isExisting, list};    
    
    // const stat = await ftp.stat(fullPath);
    //     draft.response.body = stat;
    //     return;
    
    if(isExisting){
        
    }else{
    }
}
