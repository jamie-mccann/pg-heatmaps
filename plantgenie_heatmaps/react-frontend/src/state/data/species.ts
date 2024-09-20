import piceaAbiesImage from "../../assets/img/picea_abies.jpeg";
import pinusSylvestrisImage from "../../assets/img/pinus_sylvestris.jpeg";
import populusTremulaImage from "../../assets/img/populus_tremula.jpeg";

import { SpeciesCardProps } from "../../components/SpeciesCard";

const speciesObjects: SpeciesCardProps[] = [
  {
    speciesId: "picea-abies",
    speciesName: "Picea abies",
    speciesDescription:
      "Picea abies, the Norway spruce or European spruce, is a species of spruce native to Northern, Central and Eastern Europe. The Norway spruce has a wide distribution for it being planted for its wood, and is the species used as the main Christmas tree in several countries around the world. It was the first gymnosperm to have its genome sequenced.",
    commonName: "Norway Spruce",
    imgLocation: piceaAbiesImage,
    isSelected: false,
    onSelect: () => {},
    onPlay: () => {},
  },
  {
    speciesId: "pinus-sylvestris",
    speciesName: "Pinus sylvestris",
    speciesDescription:
      "Pinus sylvestris, the Scots pine, is a species of tree in the pine family Pinaceae that is native to Eurasia. It can readily be identified by its combination of fairly short, blue-green leaves and orange-red bark. Pinus sylvestris is the only pine native to northern Europe, ranging from Western Europe to Eastern Siberia, south to the Caucasus Mountains and Anatolia, and north to well inside the Arctic Circle in Fennoscandia.",
    commonName: "Scot's Pine",
    imgLocation: pinusSylvestrisImage,
    isSelected: false,
    onSelect: () => {},
    onPlay: () => {},
  },
  {
    speciesId: "populus-tremula",
    speciesName: "Populus tremula",
    speciesDescription:
      "Populus tremula (European Aspen) is a species of poplar native to cool temperate regions of the Old World. The species is native to Europe and Asia, from Iceland and the British Isles east to Kamchatka, north to inside the Arctic Circle in Scandinavia and northern Russia, and south to central Spain, Turkey, the Tian Shan, North Korea, and northern Japan.",
    commonName: "European Aspen",
    imgLocation: populusTremulaImage,
    isSelected: false,
    onSelect: () => {},
    onPlay: () => {},
  },
];

export default speciesObjects;
