// const cache = {};
// const req = require.context('./', false, /\.(js|tsx)$/);
//
// req.keys().forEach(filename => {
//   cache[filename.replace(/\.\/|\.js/g, '')] = req(filename).default;
// });
import Divider from "./Divider";
import Icon from "./Icon";
import Toolbar from "./Toolbar";
import Typography from "./Typography";

export default {
  Divider,
  Icon,
  Toolbar,
  Typography
};