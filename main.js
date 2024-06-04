import "./style.css";
import { getWeather } from "./weather.js";
import { ICON_MAP } from "./iconMap.js";

navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

async function positionSuccess({ coords }) {
  const data = await getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  renderWeather(data);
  document.querySelector("body").classList.remove("blurred");
}

function positionError() {
  alert("There was an error getting your location. Please allow us to use your location and refresh the page.");
}

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
}

function renderCurrentWeather(current) {
  document.querySelector("[data-current-icon]").src = getIconUrl(
    current.iconCode
  );
  setValue("current-temp", current.currentTemp);
  setValue("current-high", current.highTemp);
  setValue("current-low", current.lowTemp);
  setValue("current-fl-high", current.highFeelsLike);
  setValue("current-fl-low", current.lowFeelsLike);
  setValue("current-wind", current.windSpeed);
  setValue("current-precip", current.precip);
}

function renderDailyWeather(daily) {
  const dailySection = document.querySelector("[data-day-section]");
  const dayCardTemplate = document.getElementById("day-card-template");
  dailySection.innerHTML = "";
  daily.forEach((day) => {
    const element = dayCardTemplate.content.cloneNode(true);
    setValue("temp", day.maxTemp, { parent: element });
    setValue("date", formatDate(day.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode);
    dailySection.append(element);
  });
}

function renderHourlyWeather(hourly) {
  const hourlySection = document.querySelector("[data-hour-section]");
  const hourRowTemplate = document.getElementById("hour-row-template");
  hourlySection.innerHTML = "";
  hourly.forEach((hour) => {
    const element = hourRowTemplate.content.cloneNode(true);
    setValue("temp", hour.temp, { parent: element });
    setValue("fl-temp", hour.feelsLike, { parent: element });
    setValue("wind", hour.windSpeed, { parent: element });
    setValue("precip", hour.precip, { parent: element });
    setValue("day", formatDate(hour.timestamp), { parent: element });
    setValue("time", formatTime(hour.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
    hourlySection.append(element);
  });
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric" }).format(date);
}
