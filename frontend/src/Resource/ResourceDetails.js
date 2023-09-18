import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {Button, Col, Descriptions, Row, Modal} from "antd"

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


export const ResourceDetails = () => {
    const navigate = useNavigate()
    const {resourceId} = useParams()

    const [resource, setResource] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${RESOURCES_PATH}${resourceId}`)
            .then(response => {
                setLoading(false)
                if (response.status === 200) {
                    return response.json()
                }
            })
            .then(data => setResource(data))
    }, [resourceId])

    // const handleDeleteResource = () => {
    //     fetch(CSRF_PATH)
    //         .then(response => {
    //             fetch(`${RESOURCES_PATH}${resource.id}`, {
    //                 method: "DELETE",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "X-CSRFToken": response.headers.get('X-CSRFToken'),
    //                 },
    //             })
    //                 .then(response => {
    //                     if (response.status === 204) {
    //                         navigate("/")
    //                     }
    //                     // TODO: process errors
    //                 })
    //         })
    // }

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
                        fetch(`${RESOURCES_PATH}${resource.id}`, {
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

    return (
        <>
            {
                loading ?
                    <p>Loading...</p> :
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
                                    {/*<Button*/}
                                    {/*    danger*/}
                                    {/*    onClick={handleDeleteResource}*/}
                                    {/*>*/}
                                    {/*    Delete resource*/}
                                    {/*</Button>*/}
                                </Col>
                                <Col span={16}></Col>
                            </Row>
                        </> :
                        <p>Not found</p>
            }
        </>
    )
}
