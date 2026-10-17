export const company = {
  name: "SOEICAM",
  legalName: "SOEICAM SARL",
  brand: "YOLA",
  site: "https://soeicam.com",
  email: "info@soeicam.com",
  phone: "+237 688 64 22 93",
  telephone: "+237688642293",
  whatsapp: "237688642293",
  otherPhone: "+237 681 21 89 46",
  address: "Rue Sion 1, Odza, Yaoundé, Cameroun",
};
export function whatsappUrl(message: string) {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}
