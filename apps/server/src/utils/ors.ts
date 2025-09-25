// @ts-ignore
import Openrouteservice from 'openrouteservice-js';

let orsDirections: any;

export function getOrsDirections() {
  if (!orsDirections) {
    orsDirections = new Openrouteservice.Directions({
      api_key: process.env.OSR_API,
    });
  }
  return orsDirections;
}
