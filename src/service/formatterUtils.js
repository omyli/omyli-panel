export const standarPriceFormatter = (price) => {
  return (
    "$ " +
    Number(price).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    }) +
    " MXN"
  );
};

export const translateStatusToSpanish = (status) => {
  switch (status) {
    case "RENT":
      return "Renta";
    case "SALE":
      return "Venta";
    case "INVESTMENT":
      return "Inversión";
    default:
      return "Venta";
  }
};

export const translateTypeToSpanish = (type) => {
  switch (type) {
    case "APARTMENT":
      return "Departamento";
    case "HOUSE":
      return "Casa";
    case "LAND":
      return "Terreno";
    case "COMMERCIAL":
      return "Local comercial";
    default:
      return "Tipo desconocido";
  }
};
