import { archivedLinkService } from '../../database/services/archived-links.service';
import { unavailableLinkService } from '../../database/services/unavailable-links.service';
import { ARCHIVED_LINK, UNAVAILABLE_LINK } from './constants';
import { ProductJSON } from './types';

export const getFirstGroup = (regex: RegExp, str: string): string[] => {
  return Array.from(str.matchAll(regex), m => m[1]);
};

export const parseStringObjectToJSON = (
  objString: string
): ProductJSON | null => {
  if (typeof objString != 'string') {
    return null;
  }
  return JSON.parse(JSON.stringify(eval('(' + objString + ')')));
};

export const isProductAvailable = ({
  productAvailability,
}: ProductJSON): boolean => productAvailability === 'available';

export const isProductUnavailable = ({
  productAvailability,
}: ProductJSON): boolean => productAvailability === UNAVAILABLE_LINK;

export const isProductArchived = ({
  productAvailability,
}: ProductJSON): boolean => productAvailability === ARCHIVED_LINK;

export const isExistInArchivedLinks = async (link: string): Promise<boolean> =>
  await archivedLinkService.existsByLink(link);

export const isExistInUnavailableLinks = async (
  link: string
): Promise<boolean> => await unavailableLinkService.existsByLink(link);

export const isExist = async (link: string): Promise<boolean> =>
  (await isExistInArchivedLinks(link)) ||
  (await isExistInUnavailableLinks(link));
