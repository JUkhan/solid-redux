import { createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import { action } from './store';
import { CreateReducer, ReducerMethods, ReducerOptions } from './typeHelper';
import { createAction } from './createAction';

const __state: { [key: string]: any } = {};
/**
 * A function that accepts an initial state, an object full of reducer
 * functions, and a "state name", and return actions object
 *
 */
export function createReducer<
  State extends {},
  CR extends ReducerMethods<State>,
  Name extends string = string
>(options: ReducerOptions<State, CR, Name>): CreateReducer<State, CR> {
  //@ts-ignores
  const [state, setState] = createStore(options.initialState);
  __state[options.name] = state;
  const reducers: any = options.reducers;
  options.reducers = {} as any;

  const actions = Object.keys(reducers).reduce((obj, key) => {
    const type = `${options.name}_${key}`;
    //@ts-ignores
    options.reducers[type] = reducers[key];
    //obj[key] = (payload: any) => ({ type, payload });
    obj[key] = createAction(type);
    return obj;
  }, {} as any);

  createEffect(() => {
    const ac = action();
    const fx = options.reducers[ac.type];
    //@ts-ignores
    if (typeof fx === 'function') fx(setState, ac as any);
  });
  if (typeof actions.init === 'function') setTimeout(() => actions.init());
  return { actions, state };
}

export function getState<T>(stateName?: string): T {
  if (stateName) return __state[stateName];
  return __state as T;
}
