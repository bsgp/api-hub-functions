const http = require('http');

module.exports = async (draft, { request }) => {
    return http.get('http://jsonplaceholder.typicode.com/todos/1', res => {
        const data = res.json();
        draft.response.body = data;
    })
}
