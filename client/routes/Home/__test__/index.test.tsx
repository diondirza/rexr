import React from 'react';
import { fireEvent, render } from 'test-utils';
import HomeView from '../components';

describe('<HomeView /> spec', () => {
  it('renders the HomeView', () => {
    const { container } = render(<HomeView />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('trigger counter click', () => {
    const { getByTestId } = render(<HomeView />);
    const incrementBtn = getByTestId('increment');
    const counter = getByTestId('counter');

    expect(incrementBtn).toBeInTheDocument();
    fireEvent.click(incrementBtn);
    expect(counter).toHaveTextContent('1');
  });
});
