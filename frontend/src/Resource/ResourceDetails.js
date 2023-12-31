import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {Button, Col, Descriptions, Row, Modal, Timeline} from "antd"

import {RESOURCES_PATH, CSRF_PATH} from "../Constants"
import {formatPollingInterval} from "./utils"

const {confirm} = Modal


const formatResourceDescription = (res) => ([
    {
        key: `resource-${res.id}`,
        label: 'URL',
        children: `${res.scheme}://${res.url}`,
    },
    {
        key: `polling-interval-${res.id}`,
        label: 'Polling interval',
        children: `${formatPollingInterval(res.polling_interval)}`,
    },
    {
        key: `created-${res.id}`,
        label: 'Created',
        children: `${res.created}`,
    },
])

const HHMMSS_LENGTH = "HH:MM:SS".length

const timestampAtOnFormatter = (t) => {
    if (t?.length > HHMMSS_LENGTH) {
        return `on ${t}`
    }

    return `at ${t}`
}

const formatTimeline = (data) => data.map(
    timelineItem => ({
        color: 'gray',
        children: `Down ${timestampAtOnFormatter(timelineItem.timestamp)}`,
    })
)


export const ResourceDetails = () => {
    const navigate = useNavigate()
    const {resourceId} = useParams()

    const [resource, setResource] = useState(null)
    const [timeline, setTimeline] = useState(null)
    const [nextTimelineRef, setNextTimelineRef] = useState(null)
    const [nextTimelineLoading, setNextTimelineLoading] = useState(false)
    const [resourceLoading, setResourceLoading] = useState(true)
    const [timelineLoading, setTimelineLoading] = useState(true)

    useEffect(() => {
        fetch(`${RESOURCES_PATH}/${resourceId}`)
            .then(response => {
                setResourceLoading(false)
                if (response.status === 200) {
                    return response.json()
                }
            })
            .then(data => setResource(data))
        fetch(`${RESOURCES_PATH}/${resourceId}/timeline`)
            .then(response => {
                setTimelineLoading(false)
                if (response.status === 200) {
                    return response.json()
                }
            })
            .then(data => {
                setNextTimelineRef(data?.next)
                setTimeline(data?.results)
            })
    }, [resourceId])

    const showDeleteConfirm = () => {
        confirm({
            title: 'Are you sure you want to delete this resource?',
            content: 'This action will permanently delete current resource',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                fetch(CSRF_PATH)
                    .then(response => {
                        fetch(`${RESOURCES_PATH}/${resource.id}`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                "X-CSRFToken": response.headers.get('X-CSRFToken'),
                            },
                        })
                            .then(response => {
                                if (response.status === 204) {
                                    navigate("/")
                                }
                                // TODO: process errors
                            })
                    })
            },
            onCancel() {
            },
        });
    }

    const loadMoreTimelineData = () => {
        setNextTimelineLoading(true)

        fetch(nextTimelineRef)
            .then(response => {
                setNextTimelineLoading(false)
                if (response.status === 200) {
                    return response.json()
                }
            })
            .then(data => {
                setNextTimelineRef(data.next)
                setTimeline([...timeline, ...data.results])
            })
    }

    return (
        <>
            {
                resourceLoading ?
                    <p>Loading resource...</p> :
                    resource ?
                        <>
                            <Row className="padding-bottom-20">
                                <Col span={12}>
                                    <Descriptions
                                        bordered
                                        column={1}
                                        title="Resource info"
                                        items={formatResourceDescription(resource)} />
                                </Col>
                                <Col span={12}></Col>
                            </Row>
                            <Row className="padding-bottom-20">
                                <Col span={8}>
                                    <Button
                                        danger
                                        onClick={showDeleteConfirm}
                                    >
                                        Delete resource
                                    </Button>
                                </Col>
                                <Col span={16}></Col>
                            </Row>
                        </> :
                        <p>Resource not found.</p>
            }
            {
                timelineLoading ?
                    <p>Loading timeline...</p> :
                    timeline?.length ?
                        <>
                            <Row>
                                <Col span={12}>
                                    <Timeline
                                        items={formatTimeline(timeline)}
                                    />
                                </Col>
                                <Col span={12}></Col>
                            </Row>
                            {
                                nextTimelineRef &&
                                    <Button
                                        loading={nextTimelineLoading}
                                        onClick={loadMoreTimelineData}
                                    >
                                        Load more
                                    </Button>
                            }
                        </> :
                        <p>No timeline data.</p>
            }
        </>
    )
}
