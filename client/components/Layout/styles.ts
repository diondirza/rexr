import { css } from '@emotion/core';

export const container = css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  nav {
    display: flex;
    border-bottom: 1px solid black;

    a {
      display: flex;
      flex-grow: 1;
      text-align: center;
      height: 50px;
      align-items: center;
      justify-content: center;
    }
  }

  main {
    display: flex;
    flex-direction: column;
    padding: 16px;
  }
`;
