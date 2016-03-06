import Leap from 'leapjs';
import plugins from 'leapjs-plugins';
import { updatePlayerTransform, closeHand, openHand } from './World';

export const init = () => {
  Leap.loop({

    hand: (hand) => {
      const container = document.querySelector('#renderer');
      const pos = hand.screenPosition();
      const x = (pos[0] / container.scrollWidth) * 2 - 1;
      const y = -(pos[1] / container.scrollHeight) * 2 + 1;

      updatePlayerTransform(
        'pOne',
        hand.roll(),
        hand.yaw(),
        hand.pitch(),
        { x, y });

      if (hand.grabStrength > 0.2) closeHand('pOne');
      else openHand('pOne');
    },
  })
  .use('screenPosition');
};

export default {
  init,
};
