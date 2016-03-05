import Leap from 'leapjs';

Leap.loop({

  hand: (hand) => {
    console.log(hand.screenPosition());
  },
}).use('screenPosition');
