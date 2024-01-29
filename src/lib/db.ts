const userAgent = 'Mozilla/5.0';
const amountOfLocationResults = 10;
const amountOfJourneyResults = 5;
const baseUrl = "https://v6.db.transport.rest";

async function fetchJson(url: string, options: any = {}) {
  options.headers = {...options.headers, 'User-Agent': userAgent};
  const response = await fetch(url, options);
  return await response.json();
}

export async function getLocations(query: string) {
  return await fetchJson(`${baseUrl}/locations?query=${query}&results=${amountOfLocationResults}`);
}

export async function getJourneys(start: any, end: any, departure: string = null, arrival: string = null, deTicket: boolean = true) {
  let url =`${baseUrl}/journeys?results=${amountOfJourneyResults}&stopovers=true`;

  if (arrival) url += `&arrival=${arrival}`;
  else if (departure) url += `&departure=${departure}`;

  url += start.id ? `&from=${start.id}` : `&from.longitude=${start.longitude}&from.latitude=${start.latitiude}`;
  url += end.id ? `&to=${end.id}` : `&to.longitude=${end.longitude}&to.latitude=${end.latitiude}`;

  if (deTicket) url += "&national=false&nationalExpress=false"
  
  return await fetchJson(url);
}
