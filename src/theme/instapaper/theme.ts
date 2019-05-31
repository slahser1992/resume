import variables from './variables';

// @ts-ignore
const req = require.context('./components', false, /.js|.ts$/);
let overrides = {};

req.keys().forEach((filename: string) => {
  overrides = {
    ...overrides,
    ...req(filename).default(variables),
  };
});

export default {
  ...variables.theme,
  overrides,
};
