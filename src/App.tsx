import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { loadTodos, addTodo, updateTodo, deleteTodo, type Todo } from "./store";
import type { RootState } from "./store";

function App() {
  const dispatch = useDispatch();
  const { todos, loading, error } = useSelector(
    (state: RootState) => state.todos,
  );
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    dispatch(loadTodos());
  }, [dispatch]);

  const handleAddTodo = () => {
    if (inputValue.trim() === "") return;

    dispatch(
      addTodo({
        todo: inputValue.trim(),
        userId: 1,
      }),
    );
    setInputValue("");
  };

  const toggleTodo = (todo: Todo) => {
    dispatch(
      updateTodo({
        id: todo.id,
        completed: !todo.completed,
      }),
    );
  };

  const handleDeleteTodo = (id: number) => {
    dispatch(deleteTodo({ id }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
          TODO App
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            />
            <button
              onClick={handleAddTodo}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}
          {loading && todos.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Loading todos...
            </p>
          ) : todos.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No todos yet. Add one above!
            </p>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                    className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {todo.todo}
                  </span>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded transition-colors"
                    title="Delete todo"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
