import { data } from 'sharify';
import initEditor from '../lib/editor';

export default {
  show: () => initEditor(data.PLACE),
  new: () => initEditor()
};
