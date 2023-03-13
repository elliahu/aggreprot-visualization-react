Symlink and copy the following files from protein_vizualization project.

```bash
ln -s "$PWD/../protein_visualization/output_last/DummyData.json" public/datachart_data/
```

Configuration:

```ts
let config: makeChartConfig = {
  onAreaSelected: function (min, max) {},
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
  onResidueSelectedFromProfile: (position: number, selected: boolean) => {
    console.log(
      `residue ${position} was toggled (selected=${
        selected ? "true" : "false"
      }) using aggregation profile, structure viewer will be updated`
    );
    this.props.onResidueSelectedFromProfile(position, selected);
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
  dataframes: [
    // Protein 1
    {
      indexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // x indexes
      threshold: [0.5, null, null, null, null, null, null, null, null, 0.5], // threshold
      labels: ["A", "B", null, "D", "E", "F", "G", "H", "I", "J"], // labels (sequence)
      agg: Array.from({ length: 10 }, () => Math.random()), // AGG
      asa: Array.from({ length: 10 }, () => Math.random()), // ASA
    },
    // Protein 2
    {
      indexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // x indexes
      threshold: [0.5, null, null, null, null, null, null, null, null, 0.5], // threshold
      labels: ["A", "B", null, "D", "E", "F", "G", "H", "I", "J"], // labels (sequence)
      agg: Array.from({ length: 10 }, () => Math.random()), // AGG
      asa: Array.from({ length: 10 }, () => Math.random()), // ASA
    },
  ],
};

const chartFunctions = makeChart(
  data,
  config,
  this.aggregationProfileRef.current!
);
this.props.setChartFunctions(chartFunctions);
```

Example using json file:

```ts
// fetch the file then use the data from the result
fetchData(sourceFile, 'json').then((result) => {
    setTimeout(() => {
        const chartFunctions = makeChart(result, config, this.aggregationProfileRef.current!);
        this.props.setChartFunctions(chartFunctions);
    );
});
```

Install packages and run development server.

```bash
npm install
npm start
```
