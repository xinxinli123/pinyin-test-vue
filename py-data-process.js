const fs = require('fs');
const path = require('path');

// 处理成语数据
const processChengyu = () => {
  const data = fs.readFileSync(path.join(__dirname, 'data/cy-data.txt'), 'utf8');
  const chengyuList = data.split('\n').filter(line => line.trim());
  fs.writeFileSync(
    path.join(__dirname, 'src/assets/cy-data.js'),
    `export default ${JSON.stringify(chengyuList)};`
  );
};

// 处理数字数据
const processNumbers = () => {
  const numbers = Array.from({ length: 1000 }, (_, i) => (i + 1).toString());
  fs.writeFileSync(
    path.join(__dirname, 'src/assets/sz-data.js'),
    `export default ${JSON.stringify(numbers)};`
  );
};

// 处理动物数据
const processAnimals = () => {
  const data = fs.readFileSync(path.join(__dirname, 'data/dw-data.txt'), 'utf8');
  const animals = data.split('\n')
    .filter(line => line.trim())
    .map(line => {
      const [name, pinyin, image] = line.split(',');
      return { name, pinyin, image };
    });
  fs.writeFileSync(
    path.join(__dirname, 'src/assets/dw-data.js'),
    `export default ${JSON.stringify(animals, null, 2)};`
  );
};

// 执行处理
processChengyu();
processNumbers();
processAnimals();