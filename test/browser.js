const test = require('tape');
const {_enableDOMLogging: enableDOMLogging} = require('@probe.gl/test-utils');

// require('@luma.gl/debug');

let failed = false;
test.onFinish(window.browserTestDriver_finish);
test.onFailure(() => {
  failed = true;
  window.browserTestDriver_fail();
});

// tap-browser-color alternative
enableDOMLogging({
  getStyle: message => ({
    background: failed ? '#F28E82' : '#8ECA6C',
    position: 'absolute',
    top: '500px',
    width: '100%'
  })
});

test('hubble.gl', t => {
  require('./modules');

  t.end();
});
