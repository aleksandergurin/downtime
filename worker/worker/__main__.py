import asyncio
import aiohttp
import logging
from dataclasses import dataclass

logging.basicConfig(level=logging.INFO)
log = logging.getLogger('worker')


@dataclass
class Resource:
    id: int
    schema: str
    url: str
    polling_interval: int


def get_resources_from_database():
    # TODO: implement get resources from DB
    return [
        Resource(id=1, schema='https', url='example.com', polling_interval=5),
        Resource(id=2, schema='https', url='api.github.com', polling_interval=5),
        Resource(id=2, schema='http', url='localhost:8080/api/csrf/', polling_interval=5),
    ]


async def record_down_status_into_database(resource: Resource):
    # TODO: implement send data to DB
    ...


async def polling(
    resource: Resource,
    timeout_sec: int = 10,
):
    while True:
        async with aiohttp.ClientSession() as session:
            try:
                url = f'{resource.schema}://{resource.url}'
                async with session.get(
                    url, allow_redirects=False, timeout=timeout_sec,
                ) as response:
                    if response.status != 200:
                        log.error(f'{url} status code: {response.status}')
                        await record_down_status_into_database(resource)
                    else:
                        log.info(f'{url} 200')
            except asyncio.TimeoutError:
                log.error(f'{url} timeout')
                await record_down_status_into_database(resource)
            except aiohttp.ClientConnectorError:
                log.error(f'{url} seems to be down')
                await record_down_status_into_database(resource)
        await asyncio.sleep(resource.polling_interval)


def main():
    loop = asyncio.get_event_loop()
    resources = get_resources_from_database()
    tasks = [
        polling(resource)
        for resource in resources
    ]
    try:
        loop.run_until_complete(asyncio.gather(*tasks))
    except KeyboardInterrupt:
        log.info('Worker interrupted')


if __name__ == '__main__':
    main()
