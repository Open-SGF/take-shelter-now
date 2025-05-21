import httpx

ENDPOINT = 'https://hub.arcgis.com/api/v3/datasets/bcaf5fdb3db24c78afee52d4c8a02748_5/downloads/data?format=csv&spatialRefId=4326&where=1%3D1'

def ingest():
    res = httpx.get(ENDPOINT)
    print(f"{res=}")
