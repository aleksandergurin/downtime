import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {Button, Table} from "antd"

import {RESOURCES_PATH, PAGE_SIZE} from "../Constants"
import {formatPollingInterval} from "./utils"


const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Scheme',
        dataIndex: 'scheme',
    },
    {
        title: 'URL',
        dataIndex: 'url',
    },
    {
        title: 'Polling interval',
        dataIndex: 'polling_interval',
        render: (value) => formatPollingInterval(value)
    },
    {
        title: 'Created',
        dataIndex: 'created',
    },
]


export const ResourcesList = () => {
    const navigate = useNavigate()

    const [resources, setResources] = useState(null)
    const [current, setCurrent] = useState(1)

    useEffect(() => {
        fetch(`${RESOURCES_PATH}?page=${current}`)
            .then(response => response.json())
            .then(data => setResources(data))
    }, [current])

    const handleTableChange = (pagination, filters, sorter) =>
        setCurrent(pagination.current)

    return (
        <>
            {
                resources ?
                    <>
                        <Table
                            columns={columns}
                            dataSource={resources.results}
                            pagination={{
                                current,
                                total: resources.count,
                                pageSize: PAGE_SIZE,
                            }}
                            rowKey="id"
                            onChange={handleTableChange}
                            onRow={(record, rowIndex) => ({
                                onClick: () => navigate(`resource/${record.id}`),
                            })}
                            className="padding-bottom-20"
                        />
                        <Button
                            type="primary"
                            onClick={() => navigate("/add")}
                        >
                            Add new resource
                        </Button>
                    </> :
                    <p>Loading...</p>
            }
        </>
    )
}
