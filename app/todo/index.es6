import App from '../../lib/application.es6';
import redux from './redux/index.es6';

import Routes from './routes';
import Layout from './layout';

require('./style.styl');

const rkta = new App(Routes, Layout, redux);

module.exports = rkta;
