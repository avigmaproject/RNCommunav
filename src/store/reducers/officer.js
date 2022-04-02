export const initialState = {
  officer: [],
};

const reducer = (state = initialState, action) => {
  // console.log("action.officer", action.officer);
  switch (action.type) {
    case "OFFICER": {
      return {
        ...state,
        officer: action.officer,
      };
    }

    default: {
      return state;
    }
  }
};
export default reducer;
