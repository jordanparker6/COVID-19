import boto3, os
from datetime import datetime as dt
from botocore.client import Config

def main():
    ACCESS_KEY = os.environ['DIGITAL_OCEAN_ACCESS_KEY']
    SECRET = os.environ['DIGITAL_OCEAN_SECRET_KEY']
    date = dt.today().strftime('%Y.%m.%d')
    files = ['data.csv', 'agg_data.csv', 'confirmed_cases.csv']

    # Initialize a session using DigitalOcean Spaces.
    session = boto3.session.Session()
    client = session.client('s3',
                            region_name='nyc3',
                            endpoint_url='https://nyc3.digitaloceanspaces.com',
                            aws_access_key_id=ACCESS_KEY,
                            aws_secret_access_key=SECRET)

    # Upload Files
    for file in files:
        print('Uploading: ', file)
        fn = f"{date}/{file}"
        client.upload_file(fn, 'covid-19', file)

if __name__ == "__main__":
    main()