import { createEffect, createSignal } from './signal';
import { action, getState, setGlobalSate, streams } from './store';
import { CreateReducer, ReducerMethods, ReducerOptions } from './typeHelper';

/**
 * A function that accepts an initial state, an object full of reducer
 * functions, and a "state name", and return actions object
 *
 */
export function createReducer<
  State,
  CR extends ReducerMethods<State>,
  Name extends string = string
>(options: ReducerOptions<State, CR, Name>): CreateReducer<State, CR> {
  const [state, setState] = createSignal(options.initialState);

  streams[options.name] = state;
  const reducers: any = options.reducers;
  options.reducers = {} as any;

  const actionFns = Object.keys(reducers).reduce((actions, key) => {
    const type = `${options.name}_${key}`;
    //@ts-ignores
    options.reducers[type] = reducers[key];
    actions[key] = (payload: any) => ({ type, payload });
    return actions;
  }, {} as any);

  createEffect(() => {
    setGlobalSate({ ...getState(), [options.name]: state() });
  });

  createEffect(() => {
    const ac = action();
    const fx = options.reducers[ac.type];
    if (typeof fx === 'function') setState((st: State) => fx(st, ac as any));
  });

  return actionFns;
}
