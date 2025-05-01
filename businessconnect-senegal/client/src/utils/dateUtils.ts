import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  return moment(date).format('MMMM YYYY');
};

export const parseDate = (dateString: string): Date => {
  return moment(dateString).toDate();
}; 