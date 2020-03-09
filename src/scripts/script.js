import * as api from "./api.js";
import * as create from "./classes.js";
// import * as labelStorage from "./storage.js";

function labels() {
  const labels = [];

  const labelsContainer = document.querySelector(".labels__list");

  const labelCreationButton = document.querySelector(".labels__create");
  labelCreationButton.addEventListener("click", function() {
    const template = document
      .querySelector("#labels__item")
      .content.cloneNode(true);
    labelsContainer.appendChild(template);
  });

  labelsContainer.addEventListener("change", function(e) {
    /* User changes name OR color */
    if (
      e.target.classList.contains("item__name") ||
      e.target.classList.contains("item__color")
    ) {
      let item = e.target.parentNode;
      changeLabel(item, [...labelsContainer.children], labels);
      e.target.blur();
    }
  });

  labelsContainer.addEventListener("click", function(e) {
    /* User clicks delete */
    if (e.target.classList.contains("item__delete")) {
      let item = e.target.parentNode;
      deleteLabel(item, [...labelsContainer.children], labels);
    }
  });

  labelsContainer.addEventListener("focusin", function(e) {
    if (
      e.target.classList.contains("item__name") ||
      e.target.classList.contains("item__color")
    ) {
      let item = e.target.parentNode;
      changeLabel(item, [...labelsContainer.children], labels);
    }
  });

  return labels;
}

labels();

// console.log(labelStorage);

// labelStorage.save("Hello!");
// labelStorage.load();

function changeLabel(el, elArray, labelsArray) {
  el.color = el.querySelector(".item__color");
  el.name = el.querySelector(".item__name");
  const index = elArray.indexOf(el);
  const name = el.name.value;
  const color = getColor(el.color.value);
  labelsArray[index] = new create.LightLabel(name, color.xy, color.brightness);
  changeBulbColor(color.xy, color.brightness);
}

function deleteLabel(el, elArray, labelsArray) {
  const i = elArray.indexOf(el);
  labelsArray.splice(i, 1);
  el.parentNode.removeChild(el);
}

function getColor(hex) {
  /* SEE: https://developers.meethue.com/develop/application-design-guidance/color-conversion-formulas-rgb-to-xy-and-back/ */

  const search = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  const rgb = {
    r: parseInt(search[1], 16) / 255,
    g: parseInt(search[2], 16) / 255,
    b: parseInt(search[3], 16) / 255
  };

  const gammaRGB = {
    r:
      rgb.r > 0.04045
        ? Math.pow((rgb.r + 0.055) / (1.0 + 0.055), 2.4)
        : rgb.r / 12.92,
    g:
      rgb.g > 0.04045
        ? Math.pow((rgb.g + 0.055) / (1.0 + 0.055), 2.4)
        : rgb.g / 12.92,
    b:
      rgb.b > 0.04045
        ? Math.pow((rgb.b + 0.055) / (1.0 + 0.055), 2.4)
        : rgb.b / 12.92
  };

  const xyz = {
    x: gammaRGB.r * 0.649926 + gammaRGB.g * 0.103455 + gammaRGB.b * 0.197109,
    y: gammaRGB.r * 0.234327 + gammaRGB.g * 0.743075 + gammaRGB.b * 0.022598,
    z: gammaRGB.r * 0.0 + gammaRGB.g * 0.053077 + gammaRGB.b * 1.035763
  };

  const xy = {
    x: parseFloat((xyz.x / (xyz.x + xyz.y + xyz.z)).toFixed(4)),
    y: parseFloat((xyz.y / (xyz.x + xyz.y + xyz.z)).toFixed(4))
  };

  if (isNaN(xy.x)) {
    xy.x = 0;
  }
  if (isNaN(xy.y)) {
    xy.y = 0;
  }

  const brightness = (() => {
    let value = xyz.y * 255;
    value = value.toFixed(0);
    value = parseFloat(value);
    value = value * 2;
    value = value > 255 ? 255 : value;

    return value;
  })();

  return {
    rgb: [rgb.r, rgb.g, rgb.b],
    xy: [xy.x, xy.y],
    brightness: brightness
  };
}

async function changeBulbColor(color, brightness) {
  const response = await api.put("/lights/10/state", {
    xy: color,
    bri: brightness
  });
  return response;
}
