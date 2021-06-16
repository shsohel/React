import React from 'react';
import { useSelector } from 'react-redux';

const AuthUserData = () => {
  const { authUser } = useSelector(({ auth }) => auth);

  return <div></div>;
};

export default AuthUserData;
