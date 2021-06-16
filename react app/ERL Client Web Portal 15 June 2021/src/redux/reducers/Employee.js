import { CREATE_EMPLOYEE, GET_ALL_EMPLOYEES } from '../../constants/ActionTypes';

const initialState = {
  employees: []
};

const employee = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_EMPLOYEES:
      return {
        ...state,
        employees: [...action.payload]
      };
    case CREATE_EMPLOYEE:
      return {
        ...state,
        employees: [...state.employees, action.payload]
      };
    default:
      return state;
  }
};

export default employee;
