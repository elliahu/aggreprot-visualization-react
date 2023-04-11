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
    gridColor: '#dedede',
    width: 1,
    dash: []
  },
  ticks: {
    width: 1,
    size: 10,
    dash: []
  },
  pallette: {
    threshold: {
      stroke: "rgba(0,0,0,0.5)",
      dash: [10, 10],
      spanGaps: true,
    },
    ranger: [
      {
        stroke: 'red',
        fill: 'rgba(255, 155, 84, 0.6)',
        fillTo: 0,
      },
      {
        stroke: 'green',
        fill: 'rgba(0, 255, 0, 0.2)',
        fillTo: 0,
      },
    ],
    profile: [
      [
        {
          stroke: 'red',
          fill: 'rgba(255, 155, 84, 0.6)',
          fillTo: 0,
          width: 3,
          label: 'Aggregation'
        },
        {
          stroke: 'red',
          fill: null,
          dash: [10, 5],
          label: 'ASA'
        }
      ],
      [
        {
          stroke: 'green',
          fill: 'rgba(0, 155, 0, 0.2)',
          fillTo: 0,
          width: 3,
          label: 'Aggregation'
        },
        {
          stroke: 'green',
          fill: null,
          dash: [10, 5],
          label: 'ASA'
        }
      ]
    ],
    sequence: [
      {
        stroke: 'red',
        fill: 'rgba(255, 155, 84, 0.6)',
        points: {
          show: false
        }
      },
      {
        stroke: 'green',
        fill: 'rgba(0, 255, 0, 0.2)',
        points: {
          show: false
        }
      },
    ],
  }
}

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
  selectColor: 0x0000ff
}
```

Example using raw data:

```ts
const data: makeChartData = {
  dataframes:
    [
      // Protein 1
      {
        proteinID: 'cdk4',
        indexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // x indexes
        labels: ['A', 'B', null, 'D', 'E', 'F', 'G', 'H', 'I', 'J'], // labels (sequence)
        agg: Array.from({ length: 10 }, () => Math.random()), // AGG
        asa: Array.from({ length: 10 }, () => Math.random()), // ASA
      },
      // Protein 2 
      {
        proteinID: '8fe1',
        indexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // x indexes
        labels: ['A', 'B', null, 'D', 'E', 'F', 'G', 'H', 'I', 'J'], // labels (sequence)
        agg: Array.from({ length: 10 }, () => Math.random()), // AGG
        asa: Array.from({ length: 10 }, () => Math.random()), // ASA
      }
    ]
};
ReactDOM.render(
    <React.StrictMode>
      <Aggreprot
        mapSelectedResidues={input => input}
        profileData={data}
        profileConfig={profileConfig}
        structureData={[
          {
            url: process.env.PUBLIC_URL + '/cdk4.pdb',
            format: 'pdb',
            label: 'cdk4',
          },
          {
            url: process.env.PUBLIC_URL + '/8fe1.pdb',
            format: 'pdb',
            label: '8fe1',
          }
        ]}
        structureConfig={structureConfig}
      />
    </React.StrictMode>,
    document.getElementById('root') as HTMLElement
  );
```

Example using json file:

```ts
fetchData(sourceFile, 'json').then(data => {
  ReactDOM.render(
    <React.StrictMode>
      <Aggreprot
        mapSelectedResidues={input => input}
        profileData={data}
        profileConfig={profileConfig}
        structureData={[
          {
            url: process.env.PUBLIC_URL + '/cdk4.pdb',
            format: 'pdb',
            label: 'cdk4',
          },
          {
            url: process.env.PUBLIC_URL + '/8fe1.pdb',
            format: 'pdb',
            label: '8fe1',
          }
        ]}
        structureConfig={structureConfig}
      />
    </React.StrictMode>,
    document.getElementById('root') as HTMLElement
  );
});
```
