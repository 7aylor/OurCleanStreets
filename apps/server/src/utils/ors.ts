// @ts-ignore
import Openrouteservice from 'openrouteservice-js';

let orsDirections: any;
let orsGeocode: any;

export function getOrsDirections() {
  if (!orsDirections) {
    orsDirections = new Openrouteservice.Directions({
      api_key: process.env.OSR_API,
    });
  }
  return orsDirections;
}

export function getOrsGeocode() {
  if (!orsGeocode) {
    orsGeocode = new Openrouteservice.Geocode({ api_key: process.env.OSR_API });
  }
  return orsGeocode;
}
