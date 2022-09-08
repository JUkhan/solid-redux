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

[Demo App](https://stackblitz.com/edit/vitejs-vite-cwpvly?file=src%2Fmain.tsx)

## Todo state

```ts
import { createReducer, on, PayloadAction } from 'solid-redux';

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
    init(setState) {
      setState([{ id: ++todoId, text: 'Cool', completed: false }]);
      add('Awesome');
    },
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

on(add, update, remove)
  .debounce(1000)
  .effect((action) => {
    console.log(action);
  });

const loadData = createAction('loadData');
type Data = { loading: boolean; data: any };

const data = on(loadData)
  .select<Data>(
    async (action, sendData) => {
      await delay(1000);
      sendData({ loading: true, data: 101 });
    },
    { loading: false, data: null }
  );
```

## Apply todoState in the solid component

```tsx
import { Component, For } from 'solid-js';
import { add, update, remove, todoState } from './todoState';

const Todos: Component = () => {
  let input: HTMLInputElement = null!;

  return (
    <>
      <div>
        <input ref={input} />
        <button
          onClick={(e) => {
            if (!input.value.trim()) return;
            add(input.value);
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
              onchange={[update, id]}
            />
            <span
              style={{ "text-decoration": todo.completed ? "line-through" : "none" }}
            >{text}</span>
            <span onClick={[remove, id]} style={{ color: 'red', cursor: 'pointer' }}>X</span>
          </div>
        }}
      </For>
    </>
  );
};

export default Todos;

```
