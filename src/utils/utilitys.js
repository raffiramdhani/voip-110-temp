export function formatPhoneNumber(phoneNumber) {
  // Check if the number already starts with '+62'
  if (phoneNumber.startsWith('+62')) {
    // If it starts with '+62', return the number as is
    return phoneNumber;
  }

  // Remove any non-numeric characters from the input
  const numericOnly = phoneNumber.replace(/\D/g, '');

  // Check if the number starts with '08', '628', or '8'
  if (numericOnly.startsWith('08')) {
    // If it starts with '08', add the country code and return the formatted number
    return `+62${numericOnly.substring(1)}`;
  } else if (numericOnly.startsWith('628')) {
    // If it starts with '628', return the formatted number with the country code
    return `+${numericOnly}`;
  } else if (numericOnly.startsWith('8')) {
    // If it starts with '8', add the country code and return the formatted number
    return `+62${numericOnly}`;
  } else {
    // If not, add the country code to the number and return the formatted number
    return `+62${numericOnly}`;
  }
}

export function getLocationDetail(address) {
  if (address.city_district) {
    return address.city_district.toLowerCase();
  } else if (address.city) {
    return address.city.toLowerCase();
  } else if (address.state) {
    return address.state.toLowerCase();
  } else {
    return 'Location detail not available';
  }
}
