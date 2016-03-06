import Leap from 'leapjs';
import plugins from 'leapjs-plugins';
import { updatePlayerTransform, closeHand, openHand } from './World';

export const init = () => {
  Leap.loop({

    hand: (hand) => {
      updatePlayerTransform(hand._rotation, hand.screenPosition());
      if (hand.grabStrength > 0.5) closeHand();
      else openHand();
    },
  })
  .use('screenPosition');
};

export default {
  init,
};
