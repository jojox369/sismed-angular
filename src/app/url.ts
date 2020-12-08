const appMode = 'development';
const baseUrl =
  appMode === 'development'
    ? 'http://localhost:8000/'
    : 'https://sismed-api.herokuapp.com/';

export default baseUrl;
