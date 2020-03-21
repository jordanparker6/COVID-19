import json
import pandas as pd

def flatten_json(json):
    data = map(lambda x: x['properties'], json['features'])
    return pd.DataFrame(data)

def main(filePath):
    with open(filePath, 'r') as f:
        data = json.loads(f.read())
    df = flatten_json(data)
    df.to_csv('countries-prop.csv')



if __name__ == "__main__":

    main('countries.geojson')