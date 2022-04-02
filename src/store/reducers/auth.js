export const initialState = {
  token: null,
  loggedin: false,
  usertype: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOGGED": {
      return {
        ...state,
        loggedin: true,
      };
    }
    case "SIGN_OUT": {
      return {
        ...state,
        loggedin: false,
        token: null,
      };
    }
    case "SET_USER_TYPE": {
      return {
        ...state,
        usertype: action.user,
      };
    }
    case "SET_TOKEN": {
      return {
        ...state,
        token: action.token,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
