function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class Quote {
  _id: string;
  _symbol: string;
  _price: number;
  _availableVolume: number;
  _expiration: string;

  constructor(symbol, price, availableVolume, expiration) {
    this._id = uuid();
    this._symbol = symbol;
    this._price = price;
    this._availableVolume = availableVolume;
    this._expiration = expiration;
  }

  getId() {
    // UUID
    return this._id;
  }

  setId(id) {
    this._id = id;
  }

  setSymbol(symbol) {
    // string
    this._symbol = symbol;
  }

  getSymbol() {
    return this._symbol;
  }

  setPrice(price) {
    // currency numeric type
    this._price = price;
  }

  getPrice() {
    return this._price;
  }

  setAvailableVolume(volume) {
    //int
    this._availableVolume = volume;
  }

  getAvailableVolume() {
    return this._availableVolume;
  }

  setExpiration(expiration) {
    this._expiration = expiration;
  }

  getExpiration() {
    // date
    return this._expiration;
  }
}

export class TradeResult {
  _id: string;
  _avgPrice: number;
  _symbol: string;
  _volume: number;

  constructor(symbol, avgPrice, volume) {
    this._id = uuid();
    this._symbol = symbol;
    this._avgPrice = avgPrice;
    this._volume = volume;
  }

  setId(id) {
    this._id = id;
  }
  getId() {
    return this._id;
  }
  setSymbol(symbol) {
    this._symbol = symbol;
  }
  getSymbol() {
    return this._symbol;
  }
  setVolumeWeightedAveragePrice(avgPrice) {
    this._avgPrice = avgPrice;
  }
  getVolumeWeightedAveragePrice() {
    return this._avgPrice;
  }
  setVolumeRequested(volume) {
    this._volume = volume;
  }
  getVolumeRequested() {
    return this._volume;
  }
}

// Please create your own quote manager which implements IQuoteManager interface.
//
// Do not change the interface.
//
// Please adhere to good Object Oriented Programming concepts, and create whatever support code you feel is necessary.
//
// Efficiency counts think about what data structures you use and how each method will perform.
//
// Though not required, feel free to include any notes on any areas of this interface that you would improve, or which you
// feel don't adhere to good design concepts or implementation practices.
export class QuoteManager {
  _quotes: Record<string, Quote> = {};

  constructor() {
    this._quotes = {};
  }

  // Add or update the quote (specified by Id) in symbol's book.
  // If quote is new or no longer in the book, add it. Otherwise update it to match the given price, volume, and symbol.
  addOrUpdateQuote(quote) {
    this._quotes = { ...this._quotes, [quote.getId()]: quote };
  }

  // Remove quote by Id, if quote is no longer in symbol's book do nothing.
  removeQuote(id) {
    const { [id]: quote, ...trimmedQuotes } = this._quotes;
    this._quotes = trimmedQuotes;
  }

  // Remove all quotes on the specifed symbol's book.
  removeAllQuotes(symbol) {
    const quoteKeys = Object.keys(this._quotes);
    const trimmedQuotes = quoteKeys.reduce((acc, quoteKey) => {
      if (symbol !== this._quotes[quoteKey].getSymbol()) {
        return { ...acc, [quoteKey]: this._quotes[quoteKey] };
      }
    }, {});
    this._quotes = trimmedQuotes;
  }

  // Get the best (i.e. lowest) price in the symbol's book that still has available volume.
  // If there is no quote on the symbol's book with available volume, return null.
  // Otherwise return a Quote object with all the fields set.
  // Don't return any quote which is past its expiration time, or has been removed.
  getBestQuoteWithAvailableVolume(symbol) {
    const quoteKeys = Object.keys(this._quotes);
    const quote = quoteKeys.reduce((acc, quoteKey) => {
      if (
        symbol === this._quotes[quoteKey].getSymbol() &&
        this._quotes[quoteKey].getAvailableVolume() > 0 &&
        new Date(this._quotes[quoteKey].getExpiration()) > new Date()
      ) {
        return this._quotes[quoteKey];
      }
    }, {});
    return quote || null;
  }

  // Request that a trade be executed. For the purposes of this interface, assume that the trade is a request to BUY, not sell. Do not trade an expired quotes.
  // To Execute a trade:
  //   * Search available quotes of the specified symbol from best price to worst price.
  //   * Until the requested volume has been filled, use as much available volume as necessary (up to what is available) from each quote, subtracting the used amount from the available amount.
  // For example, we have two quotes:
  //   {Price: 1.0, Volume: 1,000, AvailableVolume: 750}
  //   {Price: 2.0, Volume: 1,000, AvailableVolume: 1,000}
  // After calling once for 500 volume, the quotes are:
  //   {Price: 1.0, Volume: 1,000, AvailableVolume: 250}
  //   {Price: 2.0, Volume: 1,000, AvailableVolume: 1,000}
  // And After calling this a second time for 500 volume, the quotes are:
  //   {Price: 1.0, Volume: 1,000, AvailableVolume: 0}
  //   {Price: 2.0, Volume: 1,000, AvailableVolume: 750}
  executeTrade(symbol, volumeRequested) {}
}
