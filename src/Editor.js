import Stats from "./Stats";
import Presets from "./Presets";
import Dice from "./Dice";
import History from "./History";
import Settings from "./Settings";
import { useYDoc } from "zustand-yjs";
import {
  createTilePanes,
  TileProvider,
  TileContainer,
  DraggableTitle
} from "react-tile-pane"; // https://github.com/xcfox/react-tile-pane
import { createContext } from "react";

export const DocContext = createContext(null);

const paneStyle = {
  overflow: "auto",
  height: "100%"
};

const Editor = ({ connection }) => {
  const yDoc = useYDoc("root", connection);

  const [paneList, names] = createTilePanes({
    stats: (
      <div style={paneStyle}>
        <Stats />
      </div>
    ),
    presets: (
      <div style={paneStyle}>
        <Presets />
      </div>
    ),
    dice: (
      <div style={paneStyle}>
        <Dice />
      </div>
    ),
    history: (
      <div style={paneStyle}>
        <History />
      </div>
    ),
    settings: (
      <div style={paneStyle}>
        <Settings />
      </div>
    )
  });

  const rootPane = {
    children: [
      {
        isRow: true,
        grow: 2,
        children: [
          {
            children: [{ children: [names.stats, names.presets], grow: 5 }]
          },
          {
            children: [
              { children: names.dice, grow: 5 },

              { children: names.settings }
            ]
          },
          {
            grow: 3,
            children: [{ children: names.history }]
          }
        ]
      }
    ]
  };

  return (
    <DocContext.Provider value={{ yDoc }}>
      <TileProvider tilePanes={paneList} rootNode={rootPane}>
        <div style={{ width: "100vw", height: "100vh" }}>
          <TileContainer />
        </div>
        {/* <DraggableTitle name={names.banana}>Drag this banana🍌</DraggableTitle> */}
      </TileProvider>
    </DocContext.Provider>
  );
};

export default Editor;
