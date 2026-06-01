export const SITE = {
  title: '好物123 - 生活好物推荐指南',
  description: '精选优质好物，让生活更美好。数码、家居、生活用品真实测评推荐。',
  url: 'https://haowu123.com',
  locale: 'zh-CN',
  author: '好物推荐官',
  email: 'hello@haowu123.com',
  logo: '/images/logo.svg',
  ogImage: '/images/og-default.jpg',
};

export const CATEGORIES = [
  { name: '数码好物', slug: 'digital', description: '手机、电脑、耳机等数码产品推荐' },
  { name: '家居好物', slug: 'home', description: '家具、收纳、清洁等家居用品推荐' },
  { name: '厨房好物', slug: 'kitchen', description: '厨具、餐具、厨房电器推荐' },
  { name: '办公好物', slug: 'office', description: '办公桌椅、文具、效率工具推荐' },
  { name: '出行好物', slug: 'travel', description: '旅行箱包、户外装备推荐' },
  { name: '个护好物', slug: 'personal-care', description: '护肤、洗护、美容仪器推荐' },
];

export const ADS = {
  adsense: {
    clientId: 'ca-pub-xxxxxxxxxxxxxxxx',
    enabled: false, // 等AdSense审核通过后改为true
  },
  affiliate: {
    taobaoPid: 'mm_xxxxxxxx', // 淘宝联盟PID
    jdUnionId: 'xxxxxxxx',    // 京东联盟ID
    enabled: true,
  },
};
