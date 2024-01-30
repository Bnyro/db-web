const userAgent = 'Mozilla/5.0';
const amountOfLocationResults = 15;
const amountOfJourneyResults = 7;
const baseUrl = "https://v6.db.transport.rest";

async function fetchJson(url: string, options: any = {}) {
  options.headers = {...options.headers, 'User-Agent': userAgent};
  const response = await fetch(url, options);
  return await response.json();
}

export async function getLocations(query: string) {
  return await fetchJson(`${baseUrl}/locations?query=${query}&results=${amountOfLocationResults}`);
}

export type JourneysFunctionParams = {
  startLocation: any;
  endLocation: any;
  departure?: string;
  arrival?: string;
  includeNational?: boolean;
  earlierThanStr?: string;
  laterThanStr?: string
}

export async function getJourneys(params: JourneysFunctionParams) {
  let url =`${baseUrl}/journeys?results=${amountOfJourneyResults}&stopovers=true`;

  if (params.arrival) url += `&arrival=${params.arrival}`;
  else if (params.departure) url += `&departure=${params.departure}`;

  url += params.startLocation.id ? `&from=${params.startLocation.id}` : `&from.longitude=${params.startLocation.longitude}&from.latitude=${params.startLocation.latitiude}`;
  url += params.endLocation.id ? `&to=${params.endLocation.id}` : `&to.longitude=${params.endLocation.longitude}&to.latitude=${params.endLocation.latitiude}`;

  if (params.earlierThanStr) url += `&earlierThan=${params.earlierThanStr}`;
  if (params.laterThanStr) url += `&laterThan=${params.laterThanStr}`;

  if (!params.includeNational) url += "&national=false&nationalExpress=false";
  
  return await fetchJson(url);
}
