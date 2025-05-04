import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

export const formatDate = (date: string): string => {
  if (!date) return '';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long'
  };

  return new Date(date).toLocaleDateString('fr-FR', options);
};

export const parseDate = (dateString: string): Date => {
  return moment(dateString).toDate();
}; 