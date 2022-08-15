import {} from './createReducer';
import { shallowEqual } from './shallowEqual';
import { createEffect } from './signal';
import { streams } from './store';

export function select<T>(
  stateName: string,
  callback: (res: T) => void,
  map: (val: any) => any = (val: any) => val
) {
  if (!(stateName in streams))
    throw new Error(`"${stateName}" state name not found.`);
  let preVal: any = null;
  createEffect(() => {
    let val = map(streams[stateName]());
    if (!shallowEqual(preVal, val)) {
      callback(val);
      preVal = val;
    }
  });
}

export function selectAndMerge<T>(
  stateNames: string[],
  map: (...streamValues: any[]) => any,
  callback: (res: T) => void
) {
  stateNames.forEach((state: string) => {
    if (!(state in streams))
      throw new Error(`"${state}" state name not found.`);
  });

  let preVal: any = null;
  createEffect(() => {
    let val = map(...stateNames.map(state => streams[state]()));
    if (!shallowEqual(preVal, val)) {
      callback(val);
      preVal = val;
    }
  });
}
