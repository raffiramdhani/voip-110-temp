import { read, utils } from "xlsx";

export function formatPhoneNumber(phoneNumber) {
  // Check if the number already starts with '+62'
  if (phoneNumber.startsWith("+62")) {
    // If it starts with '+62', return the number as is
    return phoneNumber;
  }

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

const haversine = (
  { longitude: lonA, latitude: latA },
  { longitude: lonB, latitude: latB }
) => {
  const { PI, sin, cos, atan2 } = Math,
    r = PI / 180,
    R = 6371,
    deltaLat = (latB - latA) * r,
    deltaLon = (lonB - lonA) * r,
    a =
      sin(deltaLat / 2) ** 2 +
      cos(cos(latB * r) * latA * r) * sin(deltaLon / 2) ** 2,
    c = 2 * atan2(a ** 0.5, (1 - a) ** 0.5),
    d = R * c;
  return d;
};

export const getKabupatenFromCoords = async (latitude, longitude) => {
  const sheet = read(
    await (
      await fetch("/polres_queue_kabupaten_latlong.xlsx")
    ).arrayBuffer(),
    { type: "buffer" }
  );
  const data = utils
    .sheet_to_json(sheet.Sheets[sheet.SheetNames[0]], {
      header: 1,
    })
    .slice(1)
    .map((item) => {
      const kabupaten = item[2],
        latitude = Number(item[3]),
        longitude = Number(item[4]);
      return { kabupaten, latitude, longitude };
    })
    .reduce(
      (r, o) => {
        const distance = haversine({ latitude, longitude }, o);
        console.log(o.kabupaten, distance);
        if (distance < r.minDistance || !r.closest) {
          r.closest = o;
          r.minDistance = distance;
        }
        return r;
      },
      { closest: null, minDistance: null }
    );
  return data;
};

export async function getLocationDetail(locationData) {
  if (locationData?.address?.county) {
    return locationData?.address?.county?.toLowerCase();
  } else {
    const data = await getKabupatenFromCoords(
      Number(locationData?.lat),
      Number(locationData?.lon)
    );
    return data.closest.kabupaten;
  }
}
