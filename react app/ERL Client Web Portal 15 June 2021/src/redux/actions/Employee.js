import { CREATE_EMPLOYEE, GET_ALL_EMPLOYEES, UPDATE_EMPLOYEE } from 'constants/ActionTypes';
import { employeeService } from 'services/application';

export const getAll = () => dispatch => {
  employeeService
    .get_all()
    .then(response => {
      dispatch({
        type: GET_ALL_EMPLOYEES,
        payload: response.data.data
      });
    })
    .catch(error => console.log(error));
};

export const create = (model, onSuccess) => dispatch => {
  employeeService
    .create(model)
    .then(response => {
      dispatch({
        type: CREATE_EMPLOYEE,
        payload: response.data.data
      });
      onSuccess();
    })
    .catch(error => console.log(error));
};

export const update = (id, updatedData, onSuccess) => dispatch => {
  employeeService
    .update(id, updatedData)
    .then(response => {
      dispatch({
        type: UPDATE_EMPLOYEE,
        payload: response.data.data
      });
      onSuccess();
    })
    .catch(error => console.log(error));
};
