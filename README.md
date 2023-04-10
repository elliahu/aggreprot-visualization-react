Configuration:

```ts
let config: makeChartConfig = {
  debug: true,
  labelBreakPoint: 8,
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
  columnHighlight: true, // highlight columns on mouse hover
  displayThresholdLineInRanger: true,
  rangerTitle: "Ranger",
  profilePlotTitle: "Aggregation profile",
  sequencePlotTitle: "Sequence",
};
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
        mapSelectedResidues={(input: SelectedResidue) => { return input }}
        chartData={data}
        loadProteins={[
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
        mapSelectedResidues={(input: SelectedResidue) => { return input }}
        chartData={data}
        loadProteins={[
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
      />
    </React.StrictMode>,
    document.getElementById('root') as HTMLElement
  );
});
```

Install packages and run development server.

```bash
npm install
npm start
```
