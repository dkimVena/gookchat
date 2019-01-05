import { bindActionCreators } from 'redux';

import * as stateActions from './modules/state';

import store from './index';

const { dispatch } = store;

export const StateActions = bindActionCreators(stateActions, dispatch);
