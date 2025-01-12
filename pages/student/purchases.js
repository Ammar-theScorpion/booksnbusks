import StudentLayout from "../../layouts/student";
import { useWindowSize } from "../../helpers/hooks";
import { fetchPurchases } from "../../helpers/backend_helper";
import { useEffect, useState } from "react";
import { Loading } from "../../components/common/preloader";
import { Col, Row } from "react-bootstrap";
import Pagination from "../../components/common/pagination";
import Button from '../../components/form/Button.js';

const Purchases = () => {
    let { width } = useWindowSize()
    const [purchases, setPurchases] = useState()
    const [loading, setLoading] = useState(true)
    const [size, setSize] = useState(0)

    useEffect(() => {
        if (width) {
            if (width >= 1400) {
                setSize(8)
            } else {
                setSize(6)
            }
        }
    }, [width])

    useEffect(() => {
        if (size > 0) {
            getPurchases(1, size)
        }
    }, [size])

    const getPurchases = (page, size) => {
        setLoading(true)
        fetchPurchases({ page, size }).then(({ error, data }) => {
            setLoading(false)
            if (error === false) {
                setPurchases(data)
            }
        })
    }


    return (
        <>

            <div className="flex bg-white p-6 rounded-lg shadow-md items-center mt-8 hover:shadow-xl transition-all mb-5">
                <div className="flex items-center">
                    <img className="h-24" src="/images/hello.svg" alt="" />
                    <h3 className="mr-12 text-3xl my-2">Purchase History</h3>
                </div>
                <div className="flex flex-wrap md:w-1/3 justify-center items-center">
                    <h2 className="mr-12 text-base my-2"> Check the delivery status of your current and past orders!</h2>
                </div>
            </div>
            {
                loading ? (
                    <div className="flex justify-center items-center" style={{ height: '50vh' }}>
                        <Loading />
                    </div>
                ) : (
                    <>
                        <Row>
                            {purchases?.docs?.map((purchase, index) => (
                                <Col xxl={3} lg={4} md={6} key={index}>
                                    <div className="bg-white p-6 rounded-lg w-full mb-6">
                                        <div className="h-32 text-center mb-4">
                                            <img src={purchase?.product?.image} className="inline-block"
                                                style={{ maxHeight: '100%' }} alt="" />
                                        </div>
                                        <div className="h-16 mb-2">
                                            <h6 className="font-semibold">{purchase?.product?.name}</h6>
                                            <h6 className="font-semibold text-base text-primary">{purchase?.cost} Points</h6>
                                            {purchase?.status === 'Fulfilled' ? <p className="text-success">Delivered</p> : purchase?.status !== 'Unfulfilled' ? <p className="text-info">Preparing</p> : <p className="text-primary">Cancelled</p>}
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        {purchases?.totalPages > 1 && <div className="text-center">
                            <Pagination
                                pageCount={purchases?.totalPages || 1}
                                page={purchases?.page || 1}
                                onPageChange={(page) => getPurchases(page, size)}
                            />
                        </div>}

                    </>
                )
            }
        </>
    )
}
Purchases.layout = StudentLayout
export default Purchases