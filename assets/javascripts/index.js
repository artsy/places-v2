import { data } from 'sharify';
import APPS from './apps';

APPS.global();

const APP = APPS[data.APP];

if (typeof APP[data.PAGE] === 'function') APP[data.PAGE]();
