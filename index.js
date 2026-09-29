const fs = require('fs');
const executeCpp = require('./src/executor');

(async () => {
  const infiniteLoop = fs.readFileSync('./test/samples/infiniteLoop.cpp', 'utf8');
  console.log('Infinite loop:', await executeCpp(infiniteLoop));

  const syntaxError = fs.readFileSync('./test/samples/syntaxError.cpp', 'utf8');
  console.log('Syntax error:', await executeCpp(syntaxError));

  const runtimeError = fs.readFileSync('./test/samples/runtimeError.cpp', 'utf8');
  console.log('Runtime error:', await executeCpp(runtimeError));
})();