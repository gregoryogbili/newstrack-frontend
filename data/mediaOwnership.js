export const MEDIA_OWNERSHIP = {
  Reuters: {
    owner: "Thomson Reuters",
    ownerType: "Corporate",
    country: "Canada",
    politicalLean: "Neutral",
    founded: "1851",
    focus: "Global news and financial reporting",
    network: "Thomson Reuters -> Reuters",
  },

  "Associated Press": {
    owner: "Associated Press",
    ownerType: "Cooperative",
    country: "United States",
    politicalLean: "Neutral",
    founded: "1846",
    focus: "Global breaking news and wire reporting",
    network: "Associated Press",
  },

  BBC: {
    owner: "British Broadcasting Corporation",
    ownerType: "Public Corporation",
    country: "United Kingdom",
    politicalLean: "Public / Institutional",
    founded: "1922",
    focus: "Public service broadcasting and global news",
    network: "BBC -> BBC News -> BBC World Service",
  },

  "Financial Times": {
    owner: "Nikkei Inc.",
    ownerType: "Corporate",
    country: "Japan",
    politicalLean: "Centre / Pro-market",
    founded: "1888",
    focus: "Finance, economics, business, global trade",
    network: "Nikkei -> Financial Times",
  },

  Guardian: {
    owner: "Scott Trust",
    ownerType: "Trust",
    country: "United Kingdom",
    politicalLean: "Centre-left",
    founded: "1821",
    focus: "Politics, society, investigations, world news",
    network: "Scott Trust -> Guardian Media Group -> The Guardian",
  },

  "The Independent": {
    owner: "Independent Digital News & Media",
    ownerType: "Private",
    country: "United Kingdom",
    politicalLean: "Centre",
    founded: "1986",
    focus: "General news, politics, world affairs",
    network: "Independent Digital News & Media -> The Independent",
  },

  Telegraph: {
    owner: "Telegraph Media Group",
    ownerType: "Private",
    country: "United Kingdom",
    politicalLean: "Conservative",
    founded: "1855",
    focus: "Politics, business, opinion, UK affairs",
    network: "Telegraph Media Group -> The Telegraph",
  },

  "Daily Mail": {
    owner: "DMGT",
    ownerType: "Corporate",
    country: "United Kingdom",
    politicalLean: "Right",
    founded: "1896",
    focus: "UK news, politics, lifestyle, commentary",
    network: "DMGT -> Daily Mail",
  },

  Bloomberg: {
    owner: "Bloomberg L.P.",
    ownerType: "Private",
    country: "United States",
    politicalLean: "Business / Market-focused",
    founded: "1981",
    focus: "Markets, economics, business, global affairs",
    network: "Bloomberg L.P. -> Bloomberg",
  },

  "Al Jazeera": {
    owner: "Al Jazeera Media Network",
    ownerType: "State-funded",
    country: "Qatar",
    politicalLean: "State-backed / International",
    founded: "1996",
    focus: "Middle East, global affairs, investigative coverage",
    network: "Al Jazeera Media Network -> Al Jazeera",
  },

  CNN: {
    owner: "Warner Bros. Discovery",
    ownerType: "Corporate",
    country: "United States",
    politicalLean: "Centre-left",
    founded: "1980",
    focus: "Breaking news, politics, US and world coverage",
    network: "Warner Bros. Discovery -> CNN",
  },

  Fox: {
    owner: "Fox Corporation",
    ownerType: "Corporate",
    country: "United States",
    politicalLean: "Right",
    founded: "1996",
    focus: "US politics, breaking news, commentary",
    network: "Fox Corporation -> Fox News",
  },

  "New York Times": {
    owner: "The New York Times Company",
    ownerType: "Public company",
    country: "United States",
    politicalLean: "Centre-left",
    founded: "1851",
    focus: "Politics, investigations, culture, world affairs",
    network: "The New York Times Company -> The New York Times",
  },

  NBC: {
    owner: "Comcast",
    ownerType: "Corporate",
    country: "United States",
    politicalLean: "Centre-left",
    founded: "1926",
    focus: "Broadcast news, US politics, global reporting",
    network: "Comcast -> NBCUniversal -> NBC News",
  },

  ABC: {
    owner: "Disney",
    ownerType: "Corporate",
    country: "United States",
    politicalLean: "Centre",
    founded: "1943",
    focus: "US and global news coverage",
    network: "Disney -> ABC News",
  },

  DW: {
    owner: "German Federal Government",
    ownerType: "Public broadcaster",
    country: "Germany",
    politicalLean: "Public / Institutional",
    founded: "1953",
    focus: "International broadcasting",
    network: "Deutsche Welle",
  },

  Politico: {
    owner: "Axel Springer",
    ownerType: "Corporate",
    country: "Germany",
    politicalLean: "Centre",
    founded: "2007",
    focus: "Politics and policy journalism",
    network: "Axel Springer -> Politico",
  },

  Axios: {
    owner: "Axios Media",
    ownerType: "Private",
    country: "United States",
    politicalLean: "Centre",
    founded: "2016",
    focus: "Business, tech, politics",
    network: "Axios Media -> Axios",
  },
};

function extractDomain(url = "") {
  try {
    const u = new URL(url);
    return u.hostname.replace("www.", "");
  } catch {
    return null;
  }
}

export function getOwnershipInfo(sourceName, sourceUrl = null) {
  // 🔥 Match by URL (this fixes most missing ownership)
  if (sourceUrl) {
    const url = sourceUrl.toLowerCase();

    if (url.includes("bbc.co")) return MEDIA_OWNERSHIP["BBC"];
    if (url.includes("cnn.com")) return MEDIA_OWNERSHIP["CNN"];
    if (url.includes("reuters.com")) return MEDIA_OWNERSHIP["Reuters"];
    if (url.includes("apnews.com")) return MEDIA_OWNERSHIP["Associated Press"];
    if (url.includes("theguardian.com")) return MEDIA_OWNERSHIP["The Guardian"];
    if (url.includes("aljazeera.com")) return MEDIA_OWNERSHIP["Al Jazeera"];
  }

  // 1️⃣ Direct name match (existing logic)
  if (MEDIA_OWNERSHIP[sourceName]) {
    return MEDIA_OWNERSHIP[sourceName];
  }

  // 2️⃣ Try normalized name
  const normalized = Object.keys(MEDIA_OWNERSHIP).find((key) =>
    sourceName?.toLowerCase().includes(key.toLowerCase()),
  );

  if (normalized) {
    return MEDIA_OWNERSHIP[normalized];
  }

  // 3️⃣ DOMAIN INTELLIGENCE (NEW — this is the upgrade)
  if (sourceUrl) {
    try {
      const domain = extractDomain(sourceUrl);

      for (const key in DOMAIN_OWNERS) {
        if (domain.includes(key)) {
          return DOMAIN_OWNERS[key];
        }
      }
    } catch (e) {
      console.warn("Invalid URL:", sourceUrl);
    }
  }

  return null;
}

const DOMAIN_OWNERS = {
  "bbc.co.uk": MEDIA_OWNERSHIP["BBC"],
  "bbc.com": MEDIA_OWNERSHIP["BBC"],

  "reuters.com": MEDIA_OWNERSHIP["Reuters"],
  "cnn.com": MEDIA_OWNERSHIP["CNN"],

  "nytimes.com": MEDIA_OWNERSHIP["New York Times"],
  "ft.com": MEDIA_OWNERSHIP["Financial Times"],

  "theguardian.com": MEDIA_OWNERSHIP["Guardian"],

  "apnews.com": MEDIA_OWNERSHIP["Associated Press"],

  "aljazeera.com": MEDIA_OWNERSHIP["Al Jazeera"],

  "dw.com": MEDIA_OWNERSHIP["DW"],

  "politico.com": MEDIA_OWNERSHIP["Politico"],
  "politico.eu": MEDIA_OWNERSHIP["Politico"],

  "axios.com": MEDIA_OWNERSHIP["Axios"],

  "nbcnews.com": MEDIA_OWNERSHIP["NBC"],
  "abcnews.go.com": MEDIA_OWNERSHIP["ABC"],

  "bloomberg.com": {
    owner: "Bloomberg LP",
    ownerType: "Private",
    country: "United States",
    politicalLean: "Centre",
    founded: "1981",
    focus: "Finance, markets, global business",
    network: "Bloomberg LP",
  },

  "euronews.com": {
    owner: "Euronews SA",
    ownerType: "Corporate",
    country: "France",
    politicalLean: "Centre",
    founded: "1993",
    focus: "European and global news",
    network: "Euronews",
  },

  "npr.org": {
    owner: "National Public Radio",
    ownerType: "Public broadcaster",
    country: "United States",
    politicalLean: "Centre-left",
    founded: "1970",
    focus: "Public radio journalism",
    network: "NPR",
  },

  "sky.com": {
    owner: "Comcast",
    ownerType: "Corporate",
    country: "United States",
    politicalLean: "Centre-right",
    founded: "1989",
    focus: "Broadcast news",
    network: "Comcast -> Sky News",
  },

  "independent.co.uk": {
    owner: "Independent Digital News & Media",
    ownerType: "Private",
    country: "United Kingdom",
    politicalLean: "Centre",
    founded: "1986",
    focus: "UK and global news",
    network: "Independent",
  },
};
