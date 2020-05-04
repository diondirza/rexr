/**
 * We only load the polyfills if it's chrome version >= 61 and version <= 999
 */

export default async () => {
  const validations: RegExp[] = [/Chrome\/([1-9][0-9][0-9]|[7-9][0-9]|6[1-9])/];

  if (!validations.some((validation) => validation.test(navigator.userAgent))) {
    await import(/* webpackChunkName: "polyfills" */ './custom-polyfills');
  }
};
