const path = require('path');
const fs = require('fs');
const css = require('css');
const filePath = path.join(__dirname, '../assets/font/iconfont.css');
const fileStr = fs.readFileSync(filePath);
const obj = css.parse(fileStr.toString());
const outputJson = {};
obj.stylesheet.rules.forEach(val => {
  try {
    //注意如果没有自定义图标名称请使用 if (val.selectors[0].indexOf('.icon-') !== -1) {
    if (val.selectors[0].indexOf('.TRP-') !== -1) {
      let key = val.selectors[0].replace('.', '').replace(':before', '');
      let base16 = val.declarations[0].value
        .replace(/\\/g, '')
        .replace(/\"/g, '');
      outputJson[key] = parseInt(base16, 16);
    }
  } catch (e) {}
});
// const outPut = `export default ${JSON.stringify(outputJson, null, 2)}`;
const outPut = JSON.stringify(outputJson, null, 2);
fs.writeFile(
  path.join(__dirname, '../assets/font/iconfont.json'),
  outPut,
  err => {
    if (err) throw err;
    console.log('写入成功！');
  },
);