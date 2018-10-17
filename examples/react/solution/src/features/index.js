import appFeature from './app';
import homeFeature from './home';
import aboutFeature from './about';
import listFeature from './list';
import loadCannedFeature from './load-canned';
import addFeature from './add';
import loadSaveLocalForageFeature from './load-save-localforage';
import loadSaveLocalForageRxJSFeature from './load-save-localforage-rxjs';

const features = [
  appFeature,
  homeFeature,
  aboutFeature,
  listFeature,
  // loadCannedFeature,
  addFeature,
  //loadSaveLocalForageFeature,
  loadSaveLocalForageRxJSFeature
];

export default features;
