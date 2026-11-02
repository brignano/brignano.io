// A line of plain explanation and a place to read more for every holiday theme,
// so a visitor who has never heard of one can find out what it is.
const W = (page: string) => `https://en.wikipedia.org/wiki/${page}`;

export const HOLIDAY_INFO: Record<string, { about: string; url: string }> = {
  thanksgiving: { about: "A North American harvest holiday for gathering and giving thanks.", url: W("Thanksgiving") },
  winter: { about: "The December season of lights, gatherings and giving.", url: W("Winter_festival") },
  hanukkah: { about: "The Jewish eight-night Festival of Lights, with one more candle lit each night.", url: W("Hanukkah") },
  kwanzaa: { about: "A week-long celebration of African American heritage, with a candle lit each night.", url: W("Kwanzaa") },
  "new-year": { about: "The turn of the calendar year, celebrated with fireworks and fresh starts.", url: W("New_Year%27s_Day") },
  "lunar-new-year": { about: "The new year of the lunar calendar, celebrated across East and Southeast Asia with lanterns and family.", url: W("Lunar_New_Year") },
  valentines: { about: "A day for showing love and appreciation to the people you care about.", url: W("Valentine%27s_Day") },
  holi: { about: "The Hindu spring festival of colours, celebrated by throwing bright powder.", url: W("Holi") },
  "pi-day": { about: "A math holiday on 3/14, after the first digits of pi, 3.14.", url: W("Pi_Day") },
  "st-patricks": { about: "The Irish cultural and religious holiday on March 17, known for green and shamrocks.", url: W("Saint_Patrick%27s_Day") },
  "eid-al-fitr": { about: "The Muslim festival that marks the end of Ramadan, with prayers, family and food.", url: W("Eid_al-Fitr") },
  easter: { about: "The Christian celebration of the resurrection, also marked with spring eggs and bunnies.", url: W("Easter") },
  "earth-day": { about: "An annual day, April 22, for protecting the environment.", url: W("Earth_Day") },
  "eid-al-adha": { about: "The Muslim Festival of Sacrifice, honoring Ibrahim's devotion and marked by prayer and sharing food.", url: W("Eid_al-Adha") },
  pride: { about: "June is Pride Month, celebrating LGBTQ+ people and their history.", url: W("Pride_Month") },
  juneteenth: { about: "June 19, the US holiday marking the end of slavery in 1865.", url: W("Juneteenth") },
  "independence-day": { about: "The US national holiday, July 4, marking the 1776 Declaration of Independence.", url: W("Independence_Day_(United_States)") },
  halloween: { about: "October 31, a night of costumes, candy and spooky decorations.", url: W("Halloween") },
  "dia-de-muertos": { about: "The Mexican Day of the Dead, when families remember and honor loved ones who have died.", url: W("Day_of_the_Dead") },
  diwali: { about: "The Hindu, Jain and Sikh festival of lights, celebrating light over darkness.", url: W("Diwali") },
};
