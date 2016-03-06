import Leap from 'leapjs';
import plugins from 'leapjs-plugins';
import * as socket from './sockets';
import { updatePlayerTransform, closeHand, openHand } from './World';

export const init = () => {
  try {
    Leap.loop({

      hand: (hand) => {
        const container = document.querySelector('#renderer');
        const pos = hand.screenPosition();
        const x = (pos[0] / container.scrollWidth) * 2 - 1;
        const y = -(pos[1] / container.scrollHeight) * 2 + 1;

        socket.playerUpdate({
          x,
          y,
          id: 'pOne',
          roll: hand.roll(),
          yaw: hand.yaw(),
          pitch: hand.pitch(),
          grabStrength: hand.grabStrength,
        });
      },
    })
    .use('screenPosition');
  }
  catch (e) {
    console.log(e);
  }
};

export default {
  init,
};
