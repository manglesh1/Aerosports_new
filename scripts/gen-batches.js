const fs = require('fs');
const updates = JSON.parse(fs.readFileSync('scripts/sheet-updates.json', 'utf-8'));

const BATCH_SIZE = 6;
const batches = [];
for (let i = 0; i < updates.length; i += BATCH_SIZE) {
  batches.push(updates.slice(i, i + BATCH_SIZE));
}

batches.forEach((batch, idx) => {
  const batchNum = idx + 1;
  const dataArr = batch.map(item => ({
    row: item.sheetRow,
    content: item.content
  }));

  let script = `function updateBlogsBatch${batchNum}() {\n`;
  script += `  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");\n`;
  script += `  var data = ${JSON.stringify(dataArr)};\n`;
  script += `  for (var i = 0; i < data.length; i++) {\n`;
  script += `    sheet.getRange(data[i].row, 23).setValue(data[i].content);\n`;
  script += `    SpreadsheetApp.flush();\n`;
  script += `    Utilities.sleep(300);\n`;
  script += `  }\n`;
  script += `  Logger.log("Batch ${batchNum} complete: " + data.length + " rows");\n`;
  script += `}\n`;

  const filename = `scripts/batch${batchNum}.gs`;
  fs.writeFileSync(filename, script);
  const size = fs.statSync(filename).size;
  console.log(`batch${batchNum}.gs: ${batch.length} updates, ${(size / 1024).toFixed(1)}KB`);
});

console.log(`\nGenerated ${batches.length} batch files`);

// Also generate a master script that calls all batches
let master = '';
for (let i = 1; i <= batches.length; i++) {
  master += `// Run batch${i} from batch${i}.gs\n`;
}
master += `\nfunction runAllBatches() {\n`;
for (let i = 1; i <= batches.length; i++) {
  master += `  updateBlogsBatch${i}();\n`;
  master += `  Utilities.sleep(2000);\n`;
}
master += `  Logger.log("All batches complete!");\n`;
master += `}\n`;
fs.writeFileSync('scripts/master-update.gs', master);
console.log(`\nmaster-update.gs: calls all ${batches.length} batches`);
