module.exports = async (draft, context) => {
    // const { request, user, getUser, odata, soap, ftp, rfc, task, file, sql, env, lib, util, log } = context;
	// your script
	const request = context.request;
	const queryString = request.params;
	
	  
	draft.response.body = {
	    body: {
	        context: {
	            user: context.user
	        }
	    }
	};
}
