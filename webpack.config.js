const path = require('path');
const glob = require('glob');

module.exports = {
  entry: () => {
    const componentsPath = path.join(__dirname, 'public');
    return glob.sync(path.join(componentsPath, '*.component.js'));
  },
  output: {
    path: path.resolve(__dirname, 'public'),
  },
};
