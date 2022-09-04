import {
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
} from './typeHelper';
import { dispatch } from './store';

export function createAction<P = void, T extends string = string>(
  type: string
): ActionCreatorWithoutPayload<T> | ActionCreatorWithPayload<P, T> {
  const fx = (payload?: P): any => {
    return payload ? dispatch({ type, payload }) : dispatch({ type });
  };
  fx._$atype = type;
  return fx;
}
