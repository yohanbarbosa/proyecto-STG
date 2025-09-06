import { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
  switch(action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Count() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h1>hello from Hook</h1>
      <div className="text-center">
        <h1>
          Count: <span className="font-semibold">{state.count}</span>
        </h1>
        <div className="space-x-2">
          <button
            onClick={() => dispatch({ type: "increment" })}
            className="cursor-pointer bg-green-800 p-3 rounded-[10px]"
          >
            Aumentar
          </button>
          <button
            onClick={() => dispatch({ type: "decrement" })}
            className="cursor-pointer bg-red-900 p-3 rounded-[10px]"
          >
            Disminuir
          </button>
        </div>
        <div className="mt-10">
          <a href="/">Volver</a>
        </div>
      </div>
    </div>
  );
}

export default Count;
