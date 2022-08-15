export interface Action<T = any> {
  type: T;
}
export interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}
export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A
) => S;

export type ReducerMethods<State> = {
  [K: string]: Reducer<State, PayloadAction<any>>;
};
export type ValidateReducers<S, ACR extends ReducerMethods<S>> = ACR;
// &
//   {
//     [T in keyof ACR]: ACR[T] extends {
//       reducer(s: S, action?: infer A): any;
//     }
//       ? {
//           prepare(...a: never[]): Omit<A, 'type'>;
//         }
//       : {};
//   };

export declare type PayloadAction<P = void, T extends string = string> = {
  payload: P;
  type: T;
};

export interface ActionCreatorWithoutPayload<T extends string = string> {
  (): PayloadAction<void, T>;
}

export interface ActionCreatorWithPayload<P, T extends string = string> {
  (payload: P): PayloadAction<P, T>;
}
type ActionCreatorForReducer<R> = R extends (
  state: any,
  action: infer Action
) => any
  ? Action extends { payload: infer P }
    ? ActionCreatorWithPayload<P>
    : ActionCreatorWithoutPayload
  : ActionCreatorWithoutPayload;

export type ReducerActions<Reducers extends ReducerMethods<any>> = {
  [Type in keyof Reducers]: ActionCreatorForReducer<Reducers[Type]>;
};

/*export type EfffectOptioons = {
  [key: string]: EffectHandler;
};*/
export interface ReducerOptions<
  State = any,
  R extends ReducerMethods<State> = ReducerMethods<State>,
  Name extends string = string
> {
  name: Name;
  initialState: State;
  reducers: ValidateReducers<State, R>;
}
export type CreateReducer<
  State = any,
  R extends ReducerMethods<State> = ReducerMethods<State>
  //Name extends string = string
> = ReducerActions<R>;

export type EffectHandler<A extends PayloadAction = PayloadAction> = (
  action: A,
  getState: () => any
) => void;

export type EffectHandlers = {
  [K: string]: EffectHandler<PayloadAction<any>>;
};

export type ValidateHandlers<ACR extends EffectHandlers> = ACR &
  {
    [T in keyof ACR]: ACR[T] extends {
      handler(
        dispatch: (action: AnyAction) => void,
        getState: () => any,
        action?: infer A
      ): void;
    }
      ? {
          prepare(...a: never[]): Omit<A, 'type'>;
        }
      : {};
  };
/*type ActionCreatorForEffect<R> = R extends (
  dispatch: (action: AnyAction) => void,
  getState: () => any,
  action: infer Action
) => any
  ? Action extends { payload: infer P }
    ? ActionCreatorWithPayload<P>
    : ActionCreatorWithoutPayload
  : ActionCreatorWithoutPayload;

export type EffectActions<Reducers extends EffectHandlers> = {
  [Type in keyof Reducers]: ActionCreatorForEffect<Reducers[Type]>;
};
*/
///////
/*export type ReducersMapObject<S = any, A extends Action = Action> = {
  [K in keyof S]: Reducer<S[K], A>;
};
declare const $CombinedState: unique symbol;

interface EmptyObject {
  readonly [$CombinedState]?: undefined;
}
export type CombinedState<S> = EmptyObject & S;
*/

export type Identity<T> = (oldValue: T) => T;
export type WriteParam<T> = T | Identity<T>;
export type Read<T> = () => T;
export type Write<T> = (newValue: WriteParam<T>) => void;
export type EffectFn = () => void;
export type STATE<T extends object = any> = {
  [K: string]: T;
};
export type Streams<T = any> = {
  [Type in keyof STATE]: Read<
    T extends STATE['initialState'] ? STATE['initialState'] : any
  >;
};
/*export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A
) => S;

export type ReducerMethods<State> = {
  [K: string]: Reducer<State, PayloadAction<any>>;
};
export type ReducerActions<Reducers extends ReducerMethods<any>> = {
  [Type in keyof Reducers]: ActionCreatorForReducer<Reducers[Type]>;
};

*/
