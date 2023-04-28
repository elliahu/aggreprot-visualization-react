# React component library and example App for interactive 2D and 3D visualization of selected protein properties

Install packages and run development server.

```bash
npm install
npm start
```

Configuration:

```ts
const config: makeChartConfig = {
  debug: true,
  labelBreakPoint: 8,
  columnHighlight: true,
  displayThresholdLineInRanger: true,
  rangerTitle: "Ranger",
  profilePlotTitle: "Profile",
  sequencePlotTitle: "Sequence",
  grid: {
    gridColor: "#dedede",
    width: 1,
    dash: [],
  },
  ticks: {
    width: 1,
    size: 10,
    dash: [],
  },
  pallette: {
    threshold: {
      stroke: "rgba(0,0,0,0.5)",
      dash: [10, 10],
      spanGaps: true,
    },
    ranger: [
      {
        stroke: "red",
        fill: "rgba(255, 155, 84, 0.6)",
        fillTo: 0,
      },
      {
        stroke: "green",
        fill: "rgba(0, 255, 0, 0.2)",
        fillTo: 0,
      },
    ],
    profile: [
      [
        {
          stroke: "red",
          fill: "rgba(255, 155, 84, 0.6)",
          fillTo: 0,
          width: 3,
          label: "Aggregation",
        },
        {
          stroke: "red",
          fill: null,
          dash: [10, 5],
          label: "ASA",
        },
      ],
      [
        {
          stroke: "green",
          fill: "rgba(0, 155, 0, 0.2)",
          fillTo: 0,
          width: 3,
          label: "Aggregation",
        },
        {
          stroke: "green",
          fill: null,
          dash: [10, 5],
          label: "ASA",
        },
      ],
    ],
    sequence: [
      {
        stroke: "red",
        fill: "rgba(255, 155, 84, 0.6)",
        points: {
          show: false,
        },
      },
      {
        stroke: "green",
        fill: "rgba(0, 255, 0, 0.2)",
        points: {
          show: false,
        },
      },
    ],
  },
};

const structureConfig: StructureConfig = {
  viewerOptions: {
    layoutIsExpanded: false,
    layoutShowControls: true,
    layoutShowRemoteState: false,
    layoutShowSequence: true,
    layoutShowLog: false,
    layoutShowLeftPanel: false,
    layoutShowStructure: false,

    viewportShowExpand: true,
    viewportShowControls: true,
    viewportShowSettings: true,
    viewportShowSelectionMode: true,
    viewportShowAnimation: true,
  },
  backgroundColor: 0xffffff,
  selectColor: 0x0000ff,
};
```

Example using raw data:

```ts
const data: makeChartData = {
  dataframes: [
    // Protein 1
    {
      proteinID: "cdk4",
      indexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // x indexes
      labels: ["A", "B", null, "D", "E", "F", "G", "H", "I", "J"], // labels (sequence)
      agg: Array.from({ length: 10 }, () => Math.random()), // AGG
      asa: Array.from({ length: 10 }, () => Math.random()), // ASA
    },
    // Protein 2
    {
      proteinID: "8fe1",
      indexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // x indexes
      labels: ["A", "B", null, "D", "E", "F", "G", "H", "I", "J"], // labels (sequence)
      agg: Array.from({ length: 10 }, () => Math.random()), // AGG
      asa: Array.from({ length: 10 }, () => Math.random()), // ASA
    },
  ],
};
ReactDOM.render(
  <React.StrictMode>
    <Aggreprot
      mapSelectedResidues={(input) => input}
      profileData={data}
      profileConfig={profileConfig}
      structureData={[
        {
          url: process.env.PUBLIC_URL + "/cdk4.pdb",
          format: "pdb",
          label: "cdk4",
        },
        {
          url: process.env.PUBLIC_URL + "/8fe1.pdb",
          format: "pdb",
          label: "8fe1",
        },
      ]}
      structureConfig={structureConfig}
    />
  </React.StrictMode>,
  document.getElementById("root") as HTMLElement
);
```

Example using json file:

```ts
fetchData(sourceFile, "json").then((data) => {
  ReactDOM.render(
    <React.StrictMode>
      <Aggreprot
        mapSelectedResidues={(input) => input}
        profileData={data}
        profileConfig={profileConfig}
        structureData={[
          {
            url: process.env.PUBLIC_URL + "/cdk4.pdb",
            format: "pdb",
            label: "cdk4",
          },
          {
            url: process.env.PUBLIC_URL + "/8fe1.pdb",
            format: "pdb",
            label: "8fe1",
          },
        ]}
        structureConfig={structureConfig}
      />
    </React.StrictMode>,
    document.getElementById("root") as HTMLElement
  );
});
```

## How to use

Buttons at the top are not part of the component. They are added by the surrounding example application and are used to call components API.
UI is highly customizable by surrounding application - that means that the visual representation of the module is not definitive.

### 2D

- To navigate in 2D viewer use Ranger element at the top or click and hold the mouse wheel and drag to the side.
- Select one residue by clicking onto a graph value (a dot). If you click into empty space. Module will try to decide which protein you selected.
- Select by dragging to select multiple residues at once. Which protein will be selected depends on the first selected index.
- Every selection removes previous selection. If you want to keep previous selection, hold shift while selecting.
- To change the size of the view, click and expand the side of the highlighted area in the Ranger.
- If you want to have legend as a floating tooltip that follows you cursor, kindly change the config and recompile (should be done automatically). The point in the code is highlighted by POI in the comment.

```js
// App.tsx -> render()
...
profileConfig={{
  debug: true,
  legendAsTooltip: false // POI change to true if legend should float
}}
...
```

### 3D
Kindly refer to [Mol* viewer docs](https://molstar.org/viewer-docs/) for detailed information on how to use the editor.
Basic usage is to select a residue/residues in one viewer and the change is synced with other viewer. You can try it, its fun.
- Rotate the view with **Left mouse click (hold) + drag**.
- Zoom in out with mouse wheel.
- Pan in and out with **mouse wheel click (hold) + drag up / down**.
- Change draw distance by **holding shift and using mouse wheel**.
