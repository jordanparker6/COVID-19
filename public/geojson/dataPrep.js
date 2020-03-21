const fs = require('fs');
const csv = require('csv-parse/lib/sync');

const records = csv(fs.readFileSync('mappings.csv'), {
    columns: true,
    skip_empty_lines: true
  })


mapJSON('countries.geojson', records)


function cleanJSON(filePath, oldName, newName) {
    const data = fs.readFileSync(filePath)
    const json = JSON.parse(data)

    json.features = json.features.map(x => {
        x.properties[newName] = x.properties[oldName]
        delete x.properties[oldName]
        return x
    })
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2))
}

function mapJSON(filePath, records) {
    const data = fs.readFileSync(filePath)
    const json = JSON.parse(data)

    json.features = json.features.map(x => {
        const match = records.filter(record => record['From'] === x.properties.name);
        if (match && match.length) {
            x.properties.name = match[0]['To']
        }   
        return x
    });
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2))
}

