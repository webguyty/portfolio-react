import Glide from '@glidejs/glide';

new Glide('.glide', {
  type: 'carousel',
  perView: 3,
  gap: 40,
  startAt: 1,
  focusAt: 'center',
  peek: 200,
  autoplay: 3000,
  hoverpause: false,
  breakpoints: {
    1400: {
      perView: 2,
      peek: 200,
    },
    800: {
      perView: 2,
      peek: 50,
    },
  },
}).mount();
