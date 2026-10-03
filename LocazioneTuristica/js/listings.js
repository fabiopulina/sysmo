/* Listing registry — ready for AvaiBook property IDs */
(function () {
  function foto(n) {
    return "/immagini/sanchioli-11/foto-" + (n < 10 ? "0" + n : String(n)) + ".jpg";
  }
  var gallery = [];
  for (var i = 0; i <= 20; i++) gallery.push(foto(i));

  window.MAGENTA_STAY_LISTINGS = [
    {
      id: "sanchioli-11",
      name: "Sanchioli 11",
      slug: "sanchioli-11",
      path: "/strutture/sanchioli-11/",
      city: "Magenta",
      region: "MI",
      country: "IT",
      address: "Via Sanchioli 11, 20013 Magenta (MI)",
      cin: "IT015130C2SMSD6MZG",
      guests: 2,
      bedrooms: 0,
      beds: 1,
      bathrooms: 1,
      propertyType: "Entire home / studio",
      checkIn: "15:00",
      checkOut: "11:00",
      avaibookPropertyId: "408300",
      avaibookEmbed: null,
      highlights: ["~15 min Rho Fiera", "~20 min Malpensa", "Terrace", "Full kitchen"],
      cover: foto(0),
      images: gallery,
      descriptionIt:
        "Raffinato monolocale di recente costruzione in contesto signorile a Magenta, a 15 min da Rho Fiera.",
      descriptionEn:
        "Stylish recently built studio in Magenta — about 15 minutes to Rho Fiera Expo and 20 minutes to Malpensa."
    }
  ];
})();
