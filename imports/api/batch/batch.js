import { Mongo } from "meteor/mongo";

export const Batch = new Mongo.Collection("batch");
export const Panen = new Mongo.Collection("panen");
export const Kategori = new Mongo.Collection("categories");

export const KategoriHardcode = [
  { code: "fc-1", label: "Cacing Sutra" },
  { code: "fc-2", label: "Pengli" },
  { code: "fc-3", label: "PF-500" },
  { code: "fc-4", label: "Air" },
  { code: "fc-5", label: "Akomodasi" },
  { code: "fc-6", label: "Peralatan" },
  { code: "fc-6", label: "Peralatan" },
];
