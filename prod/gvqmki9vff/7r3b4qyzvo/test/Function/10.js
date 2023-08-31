module.exports = async (draft, { request }) => {
	let root = draft.pipe.json.Invoices;
    let a;
    for(let k=0;k<root['CustomerInvoice'].length;k++){
        a += root['CustomerInvoice'][`${k}`]['SystemAdministrativeData']['LastChangeDateTime'];
    }
    draft.response.body = a;
}
 