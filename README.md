Symlink and copy the following files from protein_vizualization project.
```bash
ln -s "$PWD/../protein_visualization/datachart.js" src/datachart/
cp -r "$PWD/../protein_visualization/dist" src/datachart/
ln -s "$PWD/../protein_visualization/output_last/avg_Maternal_protein_pumilio.csv" public/datachart_data/
```

Install packages and run development server.
```bash
npm install
npm start
```
