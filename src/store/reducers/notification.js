export const initialState = {
  notification: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "NOTIFICATIOV": {
      return {
        ...state,
        notification: action.notification,
      };
    }

    default: {
      return state;
    }
  }
};
export default reducer;
