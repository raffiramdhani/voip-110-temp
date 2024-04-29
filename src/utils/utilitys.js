import { parse, isDate } from "date-fns";
import DOMPurify from "dompurify";

export function formatPhoneNumber(phoneNumber) {
  // Remove any non-numeric characters from the input
  const numericOnly = phoneNumber.replace(/\D/g, "");

  // Check if the number starts with '08', '628', or '8'
  if (numericOnly.startsWith("08")) {
    // If it starts with '08', add the country code and return the formatted number
    return `+62${numericOnly.substring(1)}`;
  } else if (numericOnly.startsWith("628")) {
    // If it starts with '628', return the formatted number with the country code
    return `+${numericOnly}`;
  } else if (numericOnly.startsWith("8")) {
    // If it starts with '8', add the country code and return the formatted number
    return `+62${numericOnly}`;
  } else {
    // If not, add the country code to the number and return the formatted number
    return `+62${numericOnly}`;
  }
}

export function formatPhoneNumberStartWith8(phoneNumber) {
  // Remove any non-numeric characters from the input
  const numericOnly = phoneNumber.replace(/\D/g, "");

  // Check if the number starts with '08', '628', or '8'
  if (numericOnly.startsWith("08")) {
    // If it starts with '08', return the number starting with '8...'
    return `8${numericOnly.substring(2)}`;
  } else if (numericOnly.startsWith("628")) {
    // If it starts with '628', return the number starting with '8...'
    return `8${numericOnly.substring(3)}`;
  } else if (numericOnly.startsWith("8")) {
    // If it starts with '8', return the number as is
    return numericOnly;
  } else {
    // If not, add '8...' to the number and return
    return `8${numericOnly}`;
  }
}

export const unEscape = (htmlStr) => {
  htmlStr = htmlStr.replace(/&lt;/g, "<");
  htmlStr = htmlStr.replace(/&gt;/g, ">");
  htmlStr = htmlStr.replace(/&quot;/g, '"');
  htmlStr = htmlStr.replace(/&#39;/g, "'");
  htmlStr = htmlStr.replace(/&amp;/g, "&");
  return htmlStr;
};

export const hexHtmlToString = (str) => {
  var REG_HEX = /&#x([a-fA-F0-9]+);/g;
  return str.replace(REG_HEX, function (match, grp) {
    var num = parseInt(grp, 16);
    return String.fromCharCode(num);
  });
};

export const toAbsoluteUrl = (pathname) =>
  new URL(pathname, import.meta.url).href;

export const cleanData = (userInput) => {
  return DOMPurify.sanitize(userInput);
};

export const filenameToExtension = (fileName) => {
  return fileName.split(".").pop();
};

export const getTimestampInSeconds = () => {
  return Math.floor(Date.now() / 1000);
};

export const truncate = (str, len) => {
  return str.length > len ? `${str.substring(0, len - 3)}...` : str;
};

export const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function b64toBlob(name, b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  var byteCharacters = window.atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new File(byteArrays, name, { type: contentType });
}

export const parseTextData = (text, val = "") => {
  let data = text.split("{{name}}");
  return `${data[0]} ${val}`;
};

export const serialize = (obj) => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

export const getDate = (mode, userdate) => {
  var dte = userdate || new Date(),
    d = dte.getDate().toString(),
    m = (dte.getMonth() + 1).toString(),
    yyyy = dte.getFullYear().toString(),
    dd = d.length < 2 ? "0" + d : d,
    mm = m.length < 2 ? "0" + m : m,
    yy = yyyy.substring(2, 4);
  switch (mode) {
    case "dd_mm_yyyy":
      return dd + "_" + mm + "_" + yyyy;
    case "yyyymmdd":
      return yyyy + mm + dd;
    default:
      return dte;
  }
};

export const truncateMiddle = (fullStr, strLen, separator) => {
  if (fullStr.length <= strLen) return fullStr;

  separator = separator || "...";

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return (
    fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars)
  );
};

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0;

// ** Returns K format from a number
export const kFormatter = (num) =>
  num > 999 ? `${(num / 1000).toFixed(1)}k` : num;

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, "");

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date();
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  );
};

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */

export const parseDateString = (value, originalValue) => {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, "yyyy-MM-dd", new Date());

  return parsedDate;
};
export const formatDate = (
  value,
  formatting = { month: "short", day: "numeric", year: "numeric" }
) => {
  if (!value) return value;
  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value);
  let formatting = { month: "short", day: "numeric" };

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: "numeric", minute: "numeric" };
  }

  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};

export const timeFormat = (d) => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
};
/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem("userData");
export const getUserData = () => JSON.parse(localStorage.getItem("userData"));

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */

// fetchBlob
export const fetchBlob = async (url) => {
  const reader = await new FileReader();
  const result = await fetch(url, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const blob = await result.blob();
  reader.readAsDataURL(blob);
  reader.onload = () => {
    // console.log(reader.result);
  };
  // console.log(blob);
};

export const getType = (url) => {
  const splitURL = url.split("/");
  const filename = splitURL[splitURL.length - 1].split("?")[0]; // Remove query parameters, if any
  return filename;
};

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "#7367f01a", // for option hover bg-color
    primary: "#7367f0", // for selected option bg-color
    neutral10: "#7367f0", // for tags bg-color
    neutral20: "#ededed", // for input border-color
    neutral30: "#ededed", // for input hover border-color
  },
});

/**
 * @summary Build query string from query params object
 * @param {object} query
 * @returns string
 */
export const queryBuilder = (query) => {
  if (!query) return "";
  const queryString = new URLSearchParams(query).toString();
  return `?${queryString}`;
};

// Responsive
const intialWidth = 1440;
const intialHieght = 709;

export const responsiveWidth = (width, windowWidth) => {
  return (windowWidth * width) / intialWidth;
};

export const responsiveHeight = (height, windowHeight) => {
  return (windowHeight * height) / intialHieght;
};
