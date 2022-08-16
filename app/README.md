# solid-redux
State Management Tool for `solid.js`

## Installation

Add the solid-redux package to your project:

```
# NPM
npm i solid-redux
```

```
# YARN
yarn add solid-redux
```

## Todo state

```ts
import { createReducer, effectOn, PayloadAction } from 'solid-redux';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
let todoId = 0;

export const {
  actions: { add, update, remove },
  state: todoState,
} = createReducer({
  name: 'todos',
  initialState: [] as Todo[],
  reducers: {
    add(setState, action: PayloadAction<string>) {
      setState((todos) => [
        ...todos,
        { id: ++todoId, text: action.payload, completed: false },
      ]);
    },
    update(setState, action: PayloadAction<number>) {
      setState(
        (todo) => todo.id === action.payload,
        'completed',
        (completed) => !completed
      );
    },
    remove(setState, action: PayloadAction<number>) {
      setState((todos) => todos.filter((todo) => todo.id !== action.payload));
    },
  },
});

effectOn(add, (action) => {
  //push new record to DB
  console.log(action);
});

```

## Apply todoState in the solid component

```tsx
import { Component, For } from 'solid-js';
import { dispatch } from 'solid-redux';
import { add, update, remove, todoState } from './app-state/todoState';


const Todos: Component = () => {
  let input: HTMLInputElement = null!;

  return (
    <>
      <div>
        <input ref={input} />
        <button
          onClick={(e) => {
            if (!input.value.trim()) return;
            dispatch(add(input.value));
            input.value = "";
          }}
        >
          Add Todo
        </button>
      </div>
      <For each={todoState}>
        {(todo) => {
          const { id, text } = todo;
          console.log(`Creating ${text}`)
          return <div>
            <input
              type="checkbox"
              checked={todo.completed}
              onchange={[dispatch, update(id)]}
            />
            <span
              style={{ "text-decoration": todo.completed ? "line-through" : "none" }}
            >{text}</span>
            <span onClick={[dispatch, remove(id)]} style={{ color: 'red', cursor: 'pointer' }}>X</span>
          </div>
        }}
      </For>
    </>
  );
};

export default Todos;

```