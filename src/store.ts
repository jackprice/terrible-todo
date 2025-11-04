import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { todosSaga } from "./sagas/todosSaga";

export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  todos: [],
  loading: false,
  error: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    loadTodos(state) {
      state.loading = true;
      state.error = null;
    },
    loadTodosSuccess(state, action: PayloadAction<{ todos: Todo[] }>) {
      state.loading = false;
      state.todos = action.payload.todos;
    },
    loadTodosFailure(state, action: PayloadAction<{ error: string }>) {
      state.loading = false;
      state.error = action.payload.error;
    },
    addTodo(state, _action: PayloadAction<{ todo: string; userId: number }>) {
      state.loading = true;
      state.error = null;
    },
    addTodoSuccess(state, action: PayloadAction<{ todo: Todo }>) {
      state.loading = false;
      state.todos.push(action.payload.todo);
    },
    addTodoFailure(state, action: PayloadAction<{ error: string }>) {
      state.loading = false;
      state.error = action.payload.error;
    },
    updateTodo(
      state,
      action: PayloadAction<{ id: number; completed?: boolean; todo?: string }>,
    ) {
      state.loading = true;
      state.error = null;
    },
    updateTodoSuccess(state, action: PayloadAction<{ todo: Todo }>) {
      state.loading = false;
      state.todos = state.todos.map((t) => {
        if (t.userId === t.userId) {
          return action.payload.todo;
        }

        return t;
      });
    },
    updateTodoFailure(state, action: PayloadAction<{ error: string }>) {
      state.loading = false;
      state.error = action.payload.error;
    },
    deleteTodo(state, action: PayloadAction<{ id: number }>) {
      state.loading = true;
      state.error = null;
    },
    deleteTodoSuccess(state, action: PayloadAction<{ id: number }>) {
      state.loading = false;
      state.todos = state.todos.filter((t) => t.id !== action.payload.id);
    },
    deleteTodoFailure(state, action: PayloadAction<{ error: string }>) {
      state.loading = false;
      state.error = action.payload.error;
    },
  },
});

export const {
  loadTodos,
  loadTodosSuccess,
  loadTodosFailure,
  addTodo,
  addTodoSuccess,
  addTodoFailure,
  updateTodo,
  updateTodoSuccess,
  updateTodoFailure,
  deleteTodo,
  deleteTodoSuccess,
  deleteTodoFailure,
} = todosSlice.actions;

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    todos: todosSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
  devTools: true,
});

sagaMiddleware.run(todosSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
