// @flow

import { Action, MainLayoutState } from "../../MainLayout/types";
import moment from "moment";
import { removeProperty } from "../../utils/remove-property.ts";

const typesToSaveWithHistory: Record<string, string> = {
  BEGIN_BOX_TRANSFORM: "Transform/Move Box",
  BEGIN_MOVE_POINT: "Move Point",
  DELETE_REGION: "Delete Region",
};

export const saveToHistory = <T extends MainLayoutState>(
  state: T,
  name: string
) => ({
  ...state,
  history: [
    {
      time: moment().toDate(),
      state: removeProperty(state, "history"),
      name,
    },
    ...(state.history || []).slice(0, 8),
  ],
});

export default (
  reducer: (
    state: MainLayoutState,
    action: Action
  ) => MainLayoutState
) => {
  return (state: MainLayoutState, action: Action) => {
    const prevState = state;
    const nextState = reducer(state, action);

    if (action.type === "RESTORE_HISTORY") {
      if (state.history.length > 0) {
        return {
          ...nextState.history[0].state,
          history: nextState.history.slice(1),
        }
      }
    } else {
      if (
        prevState !== nextState &&
        Object.keys(typesToSaveWithHistory).includes(action.type)
      ) {
        const historyItem = {
          time: moment().toDate(),
          state: removeProperty(prevState, "history"),
          name: typesToSaveWithHistory[action.type] || action.type,
        };
        const prevItems = nextState.history || [];
        const newValue = [historyItem, ...prevItems].slice(0, 9);
        return {
          ...nextState,
          history: newValue,
        };
      }
    }

    return nextState;
  };
};
