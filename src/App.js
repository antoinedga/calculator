import { useReducer } from "react";
import "./styles.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGITS: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGITS: "delete-digit",
  EVALUATE: "evaluate",
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer);
  }
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGITS:
      // overwrite the last result to start next math problem instead
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGITS:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) {
        return state;
      }
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperrand == null) {
        return state;
      }
      // to replace the operation if you clicked the wrong operation
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      // take current and place
      if (state.previousOperrand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperrand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperrand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.EVALUATE:
      // dont have all steps to evaluate problem
      if (
        state.currentOperand == null ||
        state.operation == null ||
        state.previousOperrand == null
      ) {
        return state;
      }
      return {
        ...state,
        previousOperrand: null,
        operation: null,
        currentOperand: evaluate(state),
        overwrite: true,
      };

    default:
      break;
  }
}

function evaluate({ currentOperand, previousOperrand, operation }) {
  const prev = parseFloat(previousOperrand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) {
    return "";
  }
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
    default:
      break;
  }
  return computation.toString();
}

function App() {
  const [{ currentOperand, previousOperrand, operation }, dispatch] =
    useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperrand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGITS })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch}></OperationButton>
      <DigitButton digit="1" dispatch={dispatch}></DigitButton>
      <DigitButton digit="2" dispatch={dispatch}></DigitButton>
      <DigitButton digit="3" dispatch={dispatch}></DigitButton>
      <OperationButton operation="*" dispatch={dispatch}></OperationButton>
      <DigitButton digit="4" dispatch={dispatch}></DigitButton>
      <DigitButton digit="5" dispatch={dispatch}></DigitButton>
      <DigitButton digit="6" dispatch={dispatch}></DigitButton>
      <OperationButton operation="+" dispatch={dispatch}></OperationButton>
      <DigitButton digit="7" dispatch={dispatch}></DigitButton>
      <DigitButton digit="8" dispatch={dispatch}></DigitButton>
      <DigitButton digit="9" dispatch={dispatch}></DigitButton>
      <OperationButton operation="-" dispatch={dispatch}></OperationButton>
      <DigitButton digit="." dispatch={dispatch}></DigitButton>
      <DigitButton digit="0" dispatch={dispatch}></DigitButton>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
