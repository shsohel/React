import React from 'react';

const ArrayTest = () => {
  const array1 = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' }
  ];
  const array2 = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' }
  ];

  const array2Names = array2.map(e => e.name);

  const arrayYouWant = array1.filter(e => array2Names.includes(e.name) === false);

  return <div>{}</div>;
};

export default ArrayTest;
