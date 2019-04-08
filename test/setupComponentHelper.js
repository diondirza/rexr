import React from 'react';
import { render } from 'react-testing-library';

const setupComponent = (Component = null, props = {}, testIdList = []) => {
  const utils = render(<Component {...props} />);
  const testComponents = testIdList.reduce(
    (componentMap, testId) => ({
      ...componentMap,
      [testId]: utils.getByTestId(testId),
    }),
    {},
  );

  return {
    ...utils,
    meta: {
      props,
      components: testComponents,
    },
  };
};

export default setupComponent;
