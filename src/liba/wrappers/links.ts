const pushIfNotExist = (arr: string[], item: string): void => {
  if (!arr.includes(item)) {
    arr.push(item);
  }
};

export const defineCategories = (links: string[][]): string[] => {
  const categories: string[] = [];

  links.forEach(subArr => {
    subArr.forEach(link => {
      const linkParts = link.replace('https://', '').split('/');
      linkParts.length > 4
        ? pushIfNotExist(categories, linkParts.slice(1, -1).join('/'))
        : pushIfNotExist(categories, linkParts[2]);
    });
  });

  return categories;
};

type SiteCategorie = {
  name: string;
  links: string[];
};

export const sortLinksByCategories = (
  categories: string[],
  links: string[][]
): SiteCategorie[] =>
  categories.map(el => ({
    name: el,
    links: links.flat().filter(link => link.includes(el)),
  }));
