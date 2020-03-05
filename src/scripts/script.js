import * as api from "./api.js";
import * as create from "./classes.js";

const labels = [];

const el = {
  color: document.querySelector(".item__color"),
  name: document.querySelector(".item__name")
};

el.color.addEventListener("change", (e) => {
  changeLabel(0);
});

el.name.addEventListener("change", (e) => {
  changeLabel(0);
});

function getColor(hex) {
  /* SEE: https://github.com/sqmk/Phue/blob/master/library/Phue/Helper/ColorConversion.php */

  const search = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  const rgb = {
    r: parseInt(search[1], 16),
    g: parseInt(search[2], 16),
    b: parseInt(search[3], 16)
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
    x: gammaRGB.r * 0.664511 + gammaRGB.g * 0.154324 + gammaRGB.b * 0.162028,
    y: gammaRGB.r * 0.283881 + gammaRGB.g * 0.668433 + gammaRGB.b * 0.047685,
    z: gammaRGB.r * 0.000088 + gammaRGB.g * 0.07231 + gammaRGB.b * 0.986039
  };

  const xy = {
    x: (xyz.x / (xyz.x + xyz.y + xyz.z)).toFixed(4),
    y: (xyz.y / (xyz.x + xyz.y + xyz.z)).toFixed(4)
  };

  if (isNaN(xy.x)) {
    xy.x = 0;
  }
  if (isNaN(xy.y)) {
    xy.y = 0;
  }

  return {
    rgb: [rgb.r, rgb.g, rgb.b],
    xy: [parseFloat(xy.x), parseFloat(xy.y)]
  };
}

async function changeColor(color) {
  const response = await api.put("/lights/10/state", { xy: color });
  console.log(response);
  return response;
}

function changeLabel(num) {
  const name = el.name.value;
  const color = getColor(el.color.value);
  labels[num] = new create.LightLabel(name, color.xy);
  console.log(labels);
  changeColor(color.xy);
}
