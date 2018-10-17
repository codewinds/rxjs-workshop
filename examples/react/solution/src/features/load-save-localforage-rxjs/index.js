import {createFeature, expandWithFassets} from 'feature-u';
import { createLogic } from 'redux-logic';
import localforage from 'localforage';
import { createActions } from '@jeffbski/redux-util';
import { from } from 'rxjs';
import { map, concatMap, toArray } from 'rxjs/operators';

const featureName = 'loadSaveLocalForageRxJS';

// we just need an identity payload action creator in our namespace
// action type will be loadSaveLocalForage/saved
const actions = createActions('saved', { prefix: featureName });

const itemStore = localforage.createInstance({
  name: 'bookmark-notebook',
  storeName: 'items'
});

// wrap with expandWithFassets so we can use fassets.list.actions
const logic = expandWithFassets(fassets => {
  const listActions = fassets.list.actions;
  return [
    createLogic({
      name: `${featureName}.load`,
      type: listActions.load,
      latest: true,
      processOptions: {
        successType: listActions.loadSuccess,
        failType: listActions.loadFailed
      },
      process(){
        return from(itemStore.keys())
          .pipe(
            concatMap(keys => from(keys)), // iterate on each key
            concatMap(key => from(itemStore.getItem(key))),
            toArray()
          ); // returning items, will be dispatched in loadSuccess
      }
    }),
    createLogic({
      name: `${featureName}.save`,
      type: [listActions.add, listActions.remove],
      latest: true,
      processOptions: {
        successType: actions.saved,
        failType: listActions.loadFailed
      },
      process({ getState, fassets }){
        const items = fassets.list.selectors.items(getState());
        return from(itemStore.clear())
          .pipe(
            map(_ => items), // use items
            concatMap(items => from(items)), // iterate over each item
            concatMap((item, i) =>
              from(itemStore.setItem(`${i}`, item))
            ),
            toArray()
          );
      }
    }),
  ];
});

export default createFeature({
  name: featureName,

  logic,

  fassets: {
    use: [
      'list.actions',
      'list.selectors'
    ]
  },

  appDidStart({ fassets, dispatch }) {
    const listActions = fassets.list.actions;
    dispatch(listActions.load());
  }
});
