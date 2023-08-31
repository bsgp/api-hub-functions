module.exports = async (draft, { request }) => {
    // const { type: typeFromURL } = request.params || { type: "" };
    // const type = typeFromURL.toUpperCase().replace("-", "_");
    
    const typeFromURL = request.params.type || "";
    const type = typeFromURL.toUpperCase().replace("-", "_");
    
	Object.assign(draft.pipe.json, { type });
}
