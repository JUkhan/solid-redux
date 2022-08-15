import {
  createReducer,
  PayloadAction,
  getState,
  dispatch,
  createAction,
  effectOn,
  selectAndMerge,
  select,
} from '../src';

const { add, remove } = createReducer({
  name: 'counter',
  initialState: 0,
  reducers: {
    add(state, ax: PayloadAction<number>) {
      return state + ax.payload;
    },
    remove(state) {
      return state - 1;
    },
  },
});

const dx = createAction<number>('dx');
effectOn(dx, aa => {
  dispatch(add(aa.payload!));
});

describe('blah', () => {
  it('works', () => {
    select('counter', console.log, _ => ({ val: 22 }));
    selectAndMerge(['counter'], val => val * 2, console.log);
    expect(getState().counter).toEqual(0);
    dispatch(add(5));
    expect(getState().counter).toEqual(5);
    dispatch(remove());
    expect(getState().counter).toEqual(4);
    dispatch(dx(5));
    expect(getState().counter).toEqual(9);
  });
});
