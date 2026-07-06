import type { LucideIcon } from "lucide-react";
import {
  CircleDot,
  Coffee,
  Flame,
  HandHeart,
  Headphones,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
  Sprout,
  Truck,
  Warehouse,
  Wrench,
} from "lucide-react";

import aboutFarmer from "@/assets/about-farmer.jpg";
import galleryHarvest from "@/assets/gal-harvest.jpg";
import galleryPackaging from "@/assets/gal-packaging.jpg";
import galleryRoasting from "@/assets/gal-roasting.jpg";
import galleryWarehouse from "@/assets/gal-warehouse.jpg";
import galleryWorkshop from "@/assets/gal-workshop.jpg";
import heroPlantation from "@/assets/hero-plantation.jpg";
import productGreen from "@/assets/product-green.jpg";
import productGrind from "@/assets/product-grind.jpg";
import productRoasted from "@/assets/product-roasted.jpg";
import type { IconKey, ImageKey } from "./content-types";

const images: Record<ImageKey, string> = {
  aboutFarmer,
  galleryHarvest,
  galleryPackaging,
  galleryRoasting,
  galleryWarehouse,
  galleryWorkshop,
  heroPlantation,
  productGreen,
  productGrind,
  productRoasted,
};

const icons: Record<IconKey, LucideIcon> = {
  circleDot: CircleDot,
  coffee: Coffee,
  flame: Flame,
  handHeart: HandHeart,
  headphones: Headphones,
  leaf: Leaf,
  mail: Mail,
  mapPin: MapPin,
  messageCircle: MessageCircle,
  package: Package,
  shieldCheck: ShieldCheck,
  sprout: Sprout,
  truck: Truck,
  warehouse: Warehouse,
  wrench: Wrench,
};

export function getImage(key: ImageKey) {
  return images[key];
}

export function getIcon(key: IconKey) {
  return icons[key];
}
