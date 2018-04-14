module.exports = class DBFileHeader {
  constructor(uuid, version, entryCount, hasVersionMarker) {
    this.uuid = uuid;
    this.version = version;
    this.entryCount = entrycount;
    this.hasVersionMarker = hasVersionMarker;
  }
}
