import { slideDetail as home } from "./home";
import { slideDetail as about } from "./about";
import { slideDetail as solutions } from "./solutions";
import { slideDetail as technology } from "./technology";
import { slideDetail as methodology } from "./methodology";
import { slideDetail as careers } from "./careers";
import { slideDetail as contact } from "./contact";
import type { SlideDetail } from "../detailTypes";

export const DETAILS: Record<string, SlideDetail> = {
  home,
  about,
  solutions,
  technology,
  methodology,
  careers,
  contact,
};
