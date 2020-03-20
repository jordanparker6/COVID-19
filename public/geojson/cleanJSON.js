const fs = require('fs');
const csv = require('csv-parse/lib/sync');

const records = csv(fs.readFileSync('World Population - 27.02.20.csv'), {
    columns: true,
    skip_empty_lines: true
  })

mapJSON('countries.geoJSON', records)

function cleanJSON(filePath, oldName, newName) {
    let data = fs.readFileSync(filePath)
    let json = JSON.parse(data)

    json.features = json.features.map(x => {
        x.properties[newName] = x.properties[oldName]
        delete x.properties[oldName]
        return x
    })
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2))
}

function mapJSON(filePath, records) {
    let data = fs.readFileSync(filePath)
    let json = JSON.parse(data)

    json.features = json.features.map(x => {
        const match = records.filter(record => record['Country Code'] === x.properties.ISO_3_CODE);
        if (match && match.length) {
            x.properties.POP2018 = match[0]['2018']
        } else {
            x.properties.POP2018 = '0'
        }
        return x
    });
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2))
}

