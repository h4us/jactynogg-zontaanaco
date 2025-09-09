import 'dotenv/config';

import GCPTTSSpeaker from '../_speakers/gcptts.js';

// NOTE: .env
// const {
// } = process.env;

const speaker = new GCPTTSSpeaker();

const main = async () => {
  await speaker.setup();

  await speaker.speak('test message 1 2 3');
};

main();
