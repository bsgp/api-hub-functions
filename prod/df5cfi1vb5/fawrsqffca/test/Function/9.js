module.exports = async (draft, { rfc, secret }) => {
    const functionName = "ZEIS_CO_01";
    const params = {
      I_BUKRS: '5000',
      I_PERBL_FROM: '2021004',
      I_PERBL_TO: '2021006',
    };
    const connection = {
      ashost: secret.ASHOST,
      sysnr: '00',
      client: '100',
      saprouter: secret.SAPROUTER,
      user: 'rfc001',
      passwd: secret.PASSWORD,
    }
    
	
	const result = await rfc.invoke(functionName, params, connection);
	
	["ff"].reduce((acc, str)=>{
	    acc[str] = ""
	},undefined)
	
	draft.response = result;
}
