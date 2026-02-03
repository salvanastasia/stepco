import { blue, gray, pink, slate, teal } from 'tailwindcss/colors';

export interface ThemeColors {
  background: string;
  landusePark: string;
  landuseResidential: string;
  water: string;
  building: string;
  buildingOutline: string;
  roadMinor: string;
  roadMajor: string;
  roadHighway: string;
  roadLabel: string;
  roadLabelHalo: string;
  placeLabelCity: string;
  placeLabelCityHalo: string;
  placeLabelTown: string;
  placeLabelTownHalo: string;
  placeLabelCountry: string;
  placeLabelCountryHalo: string;
  border: string;
  // POI labels
  poiEntertainment: string;
  poiEntertainmentHalo: string;
  poiSport: string;
  poiSportHalo: string;
  poiGeneral: string;
  poiGeneralHalo: string;
  poiTransport: string;
  poiTransportHalo: string;
  poiParking: string;
  poiParkingHalo: string;
  poiFood: string;
  poiFoodHalo: string;
  poiLodging: string;
  poiLodgingHalo: string;
  poiPark: string;
  poiParkHalo: string;
  // Education (universities, schools)
  poiEducation: string;
  poiEducationHalo: string;
}

export const MAP_COLORS: Record<'dark' | 'light', ThemeColors> = {
  dark: {
    background: slate[800],
    landusePark: slate[700],
    landuseResidential: slate[950],
    water: blue[500],
    building: gray[800],
    buildingOutline: slate[600],
    roadMinor: slate[800],
    roadMajor: slate[700],
    roadHighway: slate[700],
    roadLabel: '#a8a29e',
    roadLabelHalo: '#020617',
    placeLabelCity: '#e7e5e4',
    placeLabelCityHalo: '#020617',
    placeLabelTown: '#d6d3d1',
    placeLabelTownHalo: '#020617',
    placeLabelCountry: '#f5f5f4',
    placeLabelCountryHalo: '#020617',
    border: slate[950],
    // POI labels - entertainment venues (theaters, cinemas, nightclubs)
    poiEntertainment: teal[400], // pink-400
    poiEntertainmentHalo: '#020617',
    // Sports venues (stadiums, arenas)
    poiSport: slate[400], // cyan-400
    poiSportHalo: '#020617',
    // General POIs (museums, galleries, etc.)
    poiGeneral: slate[400], // violet-400
    poiGeneralHalo: '#020617',
    // Transportation (metro, bus, train stations)
    poiTransport: slate[400], // blue-400
    poiTransportHalo: '#020617',
    // Parking
    poiParking: slate[400], // slate-400
    poiParkingHalo: '#020617',
    // Food & Restaurants
    poiFood: pink[100], // orange-400
    poiFoodHalo: '#020617',
    // Hotels & Lodging
    poiLodging: blue[400], // amber-400
    poiLodgingHalo: '#020617',
    // Parks & Outdoor spaces
    poiPark: '#4ade80', // green-400
    poiParkHalo: '#020617',
    // Education (universities, schools)
    poiEducation: slate[400], // orange-500 (distinct from amber lodging)
    poiEducationHalo: '#020617',
  },
  light: {
    background: '#fafaf9',
    landusePark: '#d1fae5',
    landuseResidential: '#f5f5f4',
    water: '#bfdbfe',
    building: '#e7e5e4',
    buildingOutline: '#d6d3d1',
    roadMinor: '#cbd5e1',
    roadMajor: '#64748b',
    roadHighway: '#475569',
    roadLabel: '#57534e',
    roadLabelHalo: '#fafaf9',
    placeLabelCity: '#1c1917',
    placeLabelCityHalo: '#fafaf9',
    placeLabelTown: '#44403c',
    placeLabelTownHalo: '#fafaf9',
    placeLabelCountry: '#0c0a09',
    placeLabelCountryHalo: '#fafaf9',
    border: slate[950],
    // POI labels - entertainment venues (theaters, cinemas, nightclubs)
    poiEntertainment: '#db2777', // pink-600
    poiEntertainmentHalo: '#fafaf9',
    // Sports venues (stadiums, arenas)
    poiSport: '#0891b2', // cyan-600
    poiSportHalo: '#fafaf9',
    // General POIs (museums, galleries, etc.)
    poiGeneral: '#7c3aed', // violet-600
    poiGeneralHalo: '#fafaf9',
    // Transportation (metro, bus, train stations)
    poiTransport: '#2563eb', // blue-600
    poiTransportHalo: '#fafaf9',
    // Parking
    poiParking: '#475569', // slate-600
    poiParkingHalo: '#fafaf9',
    // Food & Restaurants
    poiFood: '#ea580c', // orange-600
    poiFoodHalo: '#fafaf9',
    // Hotels & Lodging
    poiLodging: '#d97706', // amber-600
    poiLodgingHalo: '#fafaf9',
    // Parks & Outdoor spaces
    poiPark: '#16a34a', // green-600
    poiParkHalo: '#fafaf9',
    // Education (universities, schools)
    poiEducation: '#c2410c', // orange-700
    poiEducationHalo: '#fafaf9',
  },
};
