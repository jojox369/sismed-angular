let appMode = 'production';
const baseUrl =
  appMode === 'development'
    ? 'http://localhost:3000/'
    : 'https://sismed-api.herokuapp.com/';

export default baseUrl;
