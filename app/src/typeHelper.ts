import { SetStoreFunction } from 'solid-js/store';
export interface Action<T = any> {
  type: T;
}
export interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}
export type Reducer<S = any, A extends Action = AnyAction> = (
  setState: SetStoreFunction<S>,
  action: A
) => void;

export type ReducerMethods<State> = {
  [K: string]: Reducer<State, PayloadAction<any>>;
};
export type ValidateReducers<S, ACR extends ReducerMethods<S>> = ACR;

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
  State extends {},
  R extends ReducerMethods<State> = ReducerMethods<State>
  //Name extends string = string
> = {
  actions: ReducerActions<R>;
  state: State;
};
export type ActionFn<T = any> =
  | ActionCreatorWithPayload<T>
  | ActionCreatorWithoutPayload;

export type EffectHandler<A = any> = (action: PayloadAction<A>) => void;

export type EffectHandlers = {
  [K: string]: EffectHandler<PayloadAction<any>>;
};

export type ValidateHandlers<ACR extends EffectHandlers> = ACR & {
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
