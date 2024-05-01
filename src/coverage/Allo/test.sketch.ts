// ------- test --------
// console.log(productLinks.length);
// const test = [
//   'https://allo.ua/ru/materinskie-platy/asus-p7h55-m-pro-lga1156-4xddr3-dimm-1xpci-e-16x-hd-audio-7-1-ethernet-1000-mb-s-hdmi-uatx.html',
// ];

// const data = await testService.findAll([
//   'kekkeke',
//   'kekkeke123',
//   'kekkeke2',
//   'kekkeke3',
//   'kekkeke7',
//   'kekkeke4',
//   'kekkeke5',
//   'kekkeke12',
// ]);
// const data = await testService.saveAll([
//   {
//     name: 'kekew',
//     url: 'kekkeke',
//   },
//   {
//     name: 'kekew2',
//     url: 'kekkeke2',
//   },
//   {
//     name: 'kekew9',
//     url: 'kekkeke9',
//   },
//   {
//     name: 'kekew19',
//     url: 'kekkeke19',
//   },
// ]);
// console.log(data);

///////////////////////////////////////
// https://allo.ua/ru/products/mobile/samsung-c170-6227.html

//test
// const arrTest = Array.from({ length: 180 }).fill(
//   testLink[0]
// ) as string[];

// const data = (await makeQueue(
//   arrTest,
//   getProductPage
// )) as ProductParseResult[];
//
// const data = (await makeQueue(3, throttledRequests(arrTest))).filter(
//   filterAxiosErrors
// );
// .map(processBodyResponse)
// .filter(notEmpty);

// const saveLink = async (
//   url: string,
//   { productAvailability }: ProductJSON,
//   siteName: string
// ): Promise<void> => {
//   const siteId = await siteService.findByName(siteName);

//   switch (productAvailability) {
//     case ARCHIVED_LINK:
//       await archivedLinkService.save({
//         url,
//         site: siteId,
//       });
//       break;
//     case UNAVAILABLE_LINK:
//       await unavailableLinkService.save({
//         url,
//         site: siteId,
//       });
//       break;
//     default:
//       throw new Error('No one case found for: ' + productAvailability);
//   }
// };

// const testLink = [
//   'https://allo.ua/ru/products/mobile/samsung-c170-6227.html',
// ];
