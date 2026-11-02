// A line of plain explanation and a place to read more for every holiday theme,
// so a visitor who has never heard of one can find out what it is.
const W = (page: string) => `https://en.wikipedia.org/wiki/${page}`;

export const HOLIDAY_INFO: Record<string, { about: string; url: string }> = {
  thanksgiving: { about: "A harvest holiday celebrated in the US and Canada, centered on a shared meal and gratitude.", url: W("Thanksgiving") },
  winter: { about: "The December season of lights and gatherings, celebrated in many traditions.", url: W("Winter_festival") },
  hanukkah: { about: "The eight-night Jewish Festival of Lights. One more candle on the menorah is lit each night.", url: W("Hanukkah") },
  kwanzaa: { about: "A week-long celebration of African American heritage, December 26 to January 1, with a candle lit each night.", url: W("Kwanzaa") },
  "new-year": { about: "New Year's Eve and Day, with fireworks and fresh starts.", url: W("New_Year%27s_Day") },
  "lunar-new-year": { about: "The new year of the lunar calendar, celebrated across East and Southeast Asia with family, food and lanterns.", url: W("Lunar_New_Year") },
  valentines: { about: "February 14, a day of cards, flowers and notes for people you love.", url: W("Valentine%27s_Day") },
  holi: { about: "The Hindu spring festival of colors, known for throwing bright powder.", url: W("Holi") },
  "pi-day": { about: "March 14 (3/14), a nod to the first digits of pi, usually marked with math and pie.", url: W("Pi_Day") },
  "st-patricks": { about: "March 17, an Irish cultural and religious holiday known for shamrocks and the color green.", url: W("Saint_Patrick%27s_Day") },
  "eid-al-fitr": { about: "The Muslim festival that ends Ramadan, with prayers, family gatherings and sweets.", url: W("Eid_al-Fitr") },
  easter: { about: "The Christian celebration of the resurrection, also marked by spring traditions like eggs and bunnies.", url: W("Easter") },
  "earth-day": { about: "April 22, an annual day of action for the environment.", url: W("Earth_Day") },
  "eid-al-adha": { about: "The Muslim Festival of Sacrifice, observed with prayer, charity and shared meals.", url: W("Eid_al-Adha") },
  pride: { about: "June is Pride Month, a celebration of LGBTQ+ people and history.", url: W("Pride_Month") },
  juneteenth: { about: "June 19, a US holiday marking the end of slavery in 1865.", url: W("Juneteenth") },
  "independence-day": { about: "July 4, the US national holiday marking the 1776 Declaration of Independence.", url: W("Independence_Day_(United_States)") },
  halloween: { about: "October 31, with costumes, candy and spooky decorations.", url: W("Halloween") },
  "dia-de-muertos": { about: "The Mexican Day of the Dead (Oct 31 to Nov 2), when families remember loved ones with altars, marigolds and candles.", url: W("Day_of_the_Dead") },
  diwali: { about: "The festival of lights celebrated by Hindus, Jains and Sikhs, symbolizing light over darkness.", url: W("Diwali") },
};
