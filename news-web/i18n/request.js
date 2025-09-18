import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

import en from '../messages/en.json';
import th from '../messages/th.json';

const messagesMap = {en, th};

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messagesMap[locale]
  };
});
