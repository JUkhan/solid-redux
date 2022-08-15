
## Solid-redux

```ts
import {
  createReducer,
  dispatch,
  effectOn,
  PayloadAction,
} from 'solid-redux';

export interface User {
  firstName: string;
  lastName: string;
  active: boolean;
  age: number;
}
export interface Todo {
  task: string;
  done: boolean;
}

export const {
  actions: { update },
  state: userState,
} = createReducer({
  name: 'user',
  initialState: {
    firstName: 'Jasim',
    lastName: 'Khan',
    age: 23,
    active: true,
  } as User,
  reducers: {
    update(setState, action: PayloadAction<boolean>) {
      setState((state) => ({ ...state, active: action.payload }));
    },
  },
});

export const {
  actions: { updateTodo },
  state: todoState,
} = createReducer({
  name: 'todo',
  initialState: {
    task: 'learn solid.js',
    done: false,
  } as Todo,
  reducers: {
    updateTodo(setState, action: PayloadAction<boolean>) {
      setState((state) => ({ ...state, done: action.payload }));
    },
  },
});

effectOn(update, (action) => {
  //push updated record to DB
  dispatch(updateTodo(action.payload!));
});

```