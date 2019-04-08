const whitelist = [
  'p',
  'hot',
  'user',
  'feedcommunicationdetail',
  'content',
  'official-store',
  'topads',
  'wishlist',
  'favorite',
  'help',
  'peluang',
  'myorder',
  'chat',
  'resolution',
  'tokopoints',
  'tokopointsnew',
  'inbox-reputation',
  'inbox-talk',
];

export default function checkPreloadPath(pathname) {
  // validate which you want to preload
  if (pathname === '/') {
    // static adding if exact path
    return ['home'];
  }

  if (pathname === '/feed') {
    return ['feed'];
  }

  // checking if pathname is not in wishlist, to identify shoppage / pdp
  let level1 = false;
  let level2 = false;

  whitelist.forEach(item => {
    // checking level 1 pathname
    if (new RegExp(`^/${item}$`).test(pathname)) {
      level1 = true;
    }

    // checking level 2 pathname
    const regex = new RegExp(`^\\/${item}\\/*/`);

    if (pathname.match(regex)) {
      level2 = true;
    }
  });

  if (!level1 && !level2) {
    const splitting = pathname.split('/');

    return splitting.length > 2 ? ['pdp'] : ['shop'];
  }

  return [];
}
