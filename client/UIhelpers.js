import Intl from "intl";
import "intl/locale-data/jsonp/id-ID";
import moment from "moment";
import { Kategori } from "../imports/api/batch/batch";
import numeral from "numeral";
Template.registerHelper("formatRp", function (context, options) {
  if (context)
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(context);
  else {
    return "Rp. 0";
  }
});
Template.registerHelper("formatRibuan", function (context, options) {
  if (!isNaN(context)) {
    if (context && !isNaN(parseInt(context))) {
      return numeral(context).format("0,0.[00]");
    } else {
      return "0";
    }
  } else {
    // console.log("disni");
    return 0;
  }
});

Template.registerHelper("formatHRDate", function (context, options) {
  if (context) moment.locale("id");
  return moment(context).format("DD MMMM YYYY");
});

// Template.registerHelper('formatRp', function (context, options) {
//   if (context != 0) {
//     return 'Rp. ' + numeral(context).format('0,0.[00]');
//   } else {
//     return 'FREE';
//   }
// });
Template.registerHelper("nomorUrut", function (context) {
  let nomor = context;
  if (context) {
    nomor = nomor + 1;
    return nomor;
  } else {
    return 1;
  }
});
Template.registerHelper("equals", function (a, b) {
  return a == b;
});
