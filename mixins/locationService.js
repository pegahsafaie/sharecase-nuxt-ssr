/*
Example:
MapBox auto complete search: https://docs.mapbox.com/search-playground

Problem with rtl can be probably fixed by this plugin: https://www.npmjs.com/package/@mapbox/mapbox-gl-rtl-text

Scenario:
in the mapBox API which we use for our place search and autocomplete, every found feature(search result in auto complete) contains levels of accuracy starting from

1. locality
2. postcode
3. place(city)
4. region(province)
5. country

some features(based on country) dont contain some of them. for example addresses in iran just contains place, region, country.

when user saves his address -> { text, value: {locality:..., postcode: ..., region: ..., place: ...}} 
later by creating a post, we will add all this info to the post.
when others are searching:

if entered search has type of locality -> then we search for all locality!
if entered search has type of postcode -> then we search for all post codes!
if entered search has type of place -> then we search for all place!
if entered search has type of region -> then we search for all region!
if entered search has type of country -> then we search for all country!
*/

const availableAPIs = { mapbox: {
  token: process.env.MAPBOX_TOKEN,
  url: process.env.MAPBOX_URL
}};


export default {
  search(api, searchText, autoComplete, cb) {
    switch (api) {
      case 'mapbox': 
      return this.searchMapBoxAPI(searchText, autoComplete, cb);
      default:
        return [''];
    }
  },

  /**
   * It returns an array of found features. every feature contains text and value.
   * text: place_name
   * value: an object containing multi search factors 
   *        
   * example: 
   *  {
   *    text: Spitalhofstraße, 94032 Passau, Germany
   *    value: { locality: 'Haidenhof', postcode', '94032', city: 'passau', region: 'Bayern', country; 'Germany'}
   *  }
   * 
   * dependneing on search text and also the ammount of support on an area, OBJ might contain a subset of this properties.
   * so depend on how exact user search, he can later see the foods!
   *  
   * @param {*} searchText 
   * @param {*} autoComplete 
   * @param {*} cb 
   */
  searchMapBoxAPI(searchText, autoComplete = true, cb) {
    fetch(`${availableAPIs.mapbox.url}/${searchText}.json?autocomplete=${autoComplete}&access_token=${availableAPIs.mapbox.token}&country=de`).
    then(response => response.json()).
    then(body => {
      if(body) {
        const transformedAddresses = body.features.map(feature => { 
          const initialValue = {[feature.place_type[0]]: feature.text};
          const value = feature.context.reduce((obj, context) => {
            return { 
              ...obj, 
              [context.id.split('.')[0]]: context.text}
          }, initialValue);

          return { text: feature.place_name, value };
        })
        cb(transformedAddresses);
      } else {
        cb([]);
      }
    }) 
  },

  /**
   * this function receives lang anf lath and return a MAPBOX location back. this location is good to be shown in autocomplete
   */
    getReverseedGeoCode(latitude, longitude, cb) {
      fetch(`${availableAPIs.mapbox.url}/${latitude},${longitude}.json?access_token=${availableAPIs.mapbox.token}`).
      then(response => response.json()).
      then(body => {
        const value = body.features.reduce((obj, context) => { 
          return {...obj, [context.place_type[0]]: context.text }
        }, {});
        cb(value);
      });
  }
}