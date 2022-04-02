export const initialState = {
  profile: [],
};

const reducer = (state = initialState, action) => {
  // console.log("actionaction", action.data);
  switch (action.type) {
    case "SET_PROFILE": {
      return {
        ...state,
        profile: action.data,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
