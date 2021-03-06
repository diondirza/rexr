import React, { FC } from 'react';

import i18n from './locales';

const ErrorView: FC = () => (
  <div>
    An error happened! (edit this in <code>./client/components/ErrorView.js</code>){i18n.en.updateApp}
  </div>
);

export default ErrorView;
