import {
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
} from './typeHelper';

export function createAction<P = void, T extends string = string>(
  type: string
): ActionCreatorWithoutPayload<T> | ActionCreatorWithPayload<P, T> {
  return (payload?: P): any => {
    return payload ? { type, payload } : { type };
  };
}
