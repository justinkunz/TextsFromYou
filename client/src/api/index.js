import axios from 'axios';

const base = {
    get: route => axios.get('/api/' + route),
    post: (route, data) => axios.post('/api/' + route, data)
}

const getDisplay = () => base.get('display-details');
const getErrors = () => base.get('display-errors');
const postAccount = data => base.post('new-account', data);
const getUnsub = () => base.get('unsub-inst');
const getContact = () => base.get('contact-details');

export { getDisplay, postAccount, getErrors, getUnsub, getContact };