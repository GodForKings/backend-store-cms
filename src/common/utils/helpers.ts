const monthNames = [
  'янв',
  'фев',
  'мар',
  'апр',
  'мая',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
];

export const formatDate = (date: Date): string => {
  return `${date.getDate()} ${monthNames[date.getMonth()]}`;
};
