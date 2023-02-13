Symlink and copy the following files from protein_vizualization project.
```bash
ln -s "$PWD/../protein_visualization/output_last/DummyData.json" public/datachart_data/
```

Example:
```ts
let config: makeChartConfig = {
            enableControls: true,
            onAreaSelected: function (min, max) { },
            labelBreakPoint: 8,
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
            onResidueSelectedFromProfile: (position: number, selected: boolean) => {
                console.log(`residue ${position} was toggled (selected=${selected ? 'true' : 'false'}) using aggregation profile, structure viewer will be updated`);
                this.props.onResidueSelectedFromProfile(position, selected);
            },
            columnHighlight: true, // highlight columns on mouse hover
            displayThresholdLineInRanger: true,
            rangerTitle: 'Ranger',
            profilePlotTitle: 'Aggregation profile',
            sequencePlotTitle: 'Sequence',
        }

        // fetch the file then use the data from the result
        fetchData(sourceFile, 'json').then((result) => {
            setTimeout(() => {
                const chartFunctions = makeChart(result, config, this.aggregationProfileRef.current!);
                this.props.setChartFunctions(chartFunctions);
            });
        });
```

Install packages and run development server.
```bash
npm install
npm start
```
