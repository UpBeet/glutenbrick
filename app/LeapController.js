import Leap from 'leapjs';
import plugins from 'leapjs-plugins';
import { updatePlayerTransform, closeHand, openHand } from './World';

export const init = () => {
  Leap.loop({

    hand: (hand) => {
      updatePlayerTransform(
        'pOne',
        hand.roll(),
        hand.yaw(),
        hand.pitch(),
        hand.screenPosition());

      if (hand.grabStrength > 0.5) closeHand('pOne');
      else openHand('pOne');
    },
  })
  .use('screenPosition');
};

export default {
  init,
};
