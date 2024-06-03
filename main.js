import "./style.css";
import {getWeather} from "./weather.js";
import { ICON_MAP } from "./iconMap.js";

const data = await getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone);
console.log(data);
renderWeather(data);

function renderWeather({current, daily, hourly}) {
  renderCurrentWeather(current);
}

function renderCurrentWeather(current) {
  document.querySelector("[data-current-icon]").src = getIconUrl(current.iconCode);
  setValue("current-temp", current.currentTemp);
  setValue("current-high", current.highTemp);
  setValue("current-low", current.lowTemp);
  setValue("current-fl-high", current.highFeelsLike);
  setValue("current-fl-low", current.lowFeelsLike);
  setValue("current-wind", current.windSpeed);
  setValue("current-precip", current.precip);
}

function setValue(selector, value, {parent = document} = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
}