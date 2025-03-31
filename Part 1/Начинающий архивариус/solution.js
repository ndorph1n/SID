module.exports = { search };

function search(startDateStr, endDateStr, documents) {
  const startDate = new Date(startDateStr + "T00:00:00Z");
  const endDate = new Date(endDateStr + "T23:59:59Z");
  const result = [];

  const docsMap = new Map();
  for (const doc of documents) {
    docsMap.set(doc.id, doc);
  }

  for (const doc of documents) {
    const activeVersion = findActiveVersion(doc, startDate, endDate, docsMap);
    if (activeVersion) {
      result.push(activeVersion.text);
    }
  }

  return result;
}

function findActiveVersion(doc, startDate, endDate, docsMap) {
  for (const depId of doc.deps) {
    const depDoc = docsMap.get(depId);
    if (!depDoc) continue;

    const depActiveVersion = findActiveVersion(depDoc, startDate, endDate, docsMap);
    if (!depActiveVersion) {
      return null;
    }
  }

  let lastActiveVersion = null;
  let lastFrom = null;

  for (const version of doc.versions) {
    const versionFrom = version.from ? new Date(version.from) : null;
    const versionTo = version.to ? new Date(version.to) : null;

    const isActive =
      (versionFrom === null || versionFrom <= endDate) &&
      (versionTo === null || versionTo >= startDate);

    if (isActive) {
      if (lastFrom === null || (versionFrom !== null && versionFrom > lastFrom)) {
        lastFrom = versionFrom;
        lastActiveVersion = version;
      }
    }
  }

  return lastActiveVersion;
}
