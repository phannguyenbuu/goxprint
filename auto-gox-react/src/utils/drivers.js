let driverCatalogs = { ricoh: [], toshiba: [], fujifilm: [] };

export async function loadDriverCatalogs() {
  try {
    const [r, t, f] = await Promise.all([
      fetch('/drivers/ricoh.json').then(res => res.json()).catch(() => []),
      fetch('/drivers/toshiba.json').then(res => res.json()).catch(() => []),
      fetch('/drivers/fujifilm.json').then(res => res.json()).catch(() => [])
    ]);
    driverCatalogs.ricoh = Array.isArray(r) ? r : [];
    driverCatalogs.toshiba = Array.isArray(t) ? t : [];
    driverCatalogs.fujifilm = Array.isArray(f) ? f : [];
  } catch(e) {
    console.error('Failed to load local driver catalogs', e);
  }
}

function cleanTokens(name) {
  const matches = name.toLowerCase().match(/[a-z0-9]+/g);
  return matches || [];
}

export function matchPrinterDrivers(printerName) {
  const queryTokens = cleanTokens(printerName);
  if (!queryTokens.length) return [];
  
  const nameLower = printerName.toLowerCase();
  let brandsToSearch = [];
  
  const isRicoh = ["ricoh", "aficio", "savin", "gestetner", "lanier", "infotec", "mp ", "im ", "pro "].some(k => nameLower.includes(k));
  const isToshiba = ["toshiba", "e-studio"].some(k => nameLower.includes(k));
  const isFuji = ["fujifilm", "fuji", "xerox", "apeos", "docucentre", "docuprint"].some(k => nameLower.includes(k));
  
  if (isRicoh) brandsToSearch.push({ brand: 'ricoh', catalog: driverCatalogs.ricoh });
  if (isToshiba) brandsToSearch.push({ brand: 'toshiba', catalog: driverCatalogs.toshiba });
  if (isFuji) brandsToSearch.push({ brand: 'fujifilm', catalog: driverCatalogs.fujifilm });
  
  if (!brandsToSearch.length) {
    brandsToSearch = [
      { brand: 'ricoh', catalog: driverCatalogs.ricoh },
      { brand: 'toshiba', catalog: driverCatalogs.toshiba },
      { brand: 'fujifilm', catalog: driverCatalogs.fujifilm }
    ];
  }
  
  let matches = [];
  const digitsInQuery = (printerName.match(/\d+/g) || []);
  
  for (const { brand, catalog } of brandsToSearch) {
    for (const item of catalog) {
      const modelName = item.model || item.name || "";
      if (!modelName) continue;
      
      const modelTokens = cleanTokens(modelName);
      let score = 0;
      
      const intersection = queryTokens.filter(t => modelTokens.includes(t));
      score += intersection.length * 10;
      
      const modelLower = modelName.toLowerCase();
      if (nameLower.includes(modelLower) || modelLower.includes(nameLower)) {
        score += 30;
      }
      
      const digitsInModel = (modelName.match(/\d+/g) || []);
      if (digitsInQuery.length && digitsInModel.length) {
        const digitIntersection = digitsInQuery.filter(d => digitsInModel.includes(d));
        if (digitIntersection.length) {
          score += 100;
        } else {
          score -= 100;
        }
      }
      
      score -= Math.abs(printerName.length - modelName.length) * 0.5;
      
      let driversList = [];
      if (brand === 'ricoh') {
        const driversField = item.drivers || {};
        for (const [k, v] of Object.entries(driversField)) {
          driversList.push({ name: k, url: v });
        }
      } else if (brand === 'toshiba') {
        const driversField = item.drivers || [];
        for (const d of driversField) {
          const dUrl = (d.download_url || "").trim();
          const dName = (d.name || d.description || "Driver").trim();
          const itemDict = { name: dName, url: dUrl };
          if (dUrl.includes("CSW2202CUPD01.zip") || dName.includes("Universal")) {
            if (!driversList.find(x => x.name === itemDict.name && x.url === itemDict.url)) {
              driversList.unshift(itemDict);
            }
          } else {
            if (!driversList.find(x => x.name === itemDict.name && x.url === itemDict.url)) {
              driversList.push(itemDict);
            }
          }
        }
      } else if (brand === 'fujifilm') {
        const driversField = item.drivers || [];
        for (const d of driversField) {
          const dUrl = (d.url || "").trim();
          const dName = (d.name || "Driver").trim();
          if (!driversList.find(x => x.name === dName && x.url === dUrl)) {
            driversList.push({ name: dName, url: dUrl });
          }
        }
      }
      
      if (score > 0 && driversList.length > 0) {
        matches.push({
          score: score,
          brand: brand,
          model: modelName,
          drivers: driversList
        });
      }
    }
  }
  
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 3);
}
