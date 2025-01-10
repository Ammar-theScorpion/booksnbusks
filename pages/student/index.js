import StudentLayout from "../../layouts/student";
import { Col, Modal, Row } from "react-bootstrap";
import moment from "moment";
import { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/user";
import Link from 'next/link'
import { notification, Progress } from "antd";
import { swalLoading } from "../../components/common/alert";
import { postPurchase } from "../../helpers/backend_helper";
import swal from "sweetalert2";
import { useRouter } from "next/router";

const Home = () => {
    const time = moment()
    const user = useUserContext()


    const [purchase, setPurchase] = useState()
    const handlePurchase = async _id => {
        swalLoading()
        let { error, msg } = await postPurchase({ _id })
        swal.close()
        if (error === false) {
            setPurchase({
                ...purchase,
                done: true,
            })
            user.getProfile()
        } else {
            await notification.error({ message: "Error", description: msg })
        }
    }

    const router = useRouter()
    useEffect(() => {
        router.push('/student/store/')

    }, [])

    return <></>

    return (
        <>
            <Modal show={purchase} size="lg" centered>
                <Modal.Body>
                    <Row>
                        <Col md={6} className="text-center">
                            <img className="h-72 inline-block" src={purchase?.image} alt="" />
                        </Col>
                        <Col md={6} className="my-auto">
                            <p className="text-center text-4xl font-semibold text-5A mb-4">
                                {purchase?.done ? "You Purchased" : <>Would you like <br /> to purchase</>}
                            </p>
                            <p className="text-center text-5xl font-semibold">{purchase?.name}</p>
                            <p className="text-center text-4xl font-semibold text-5A">
                                {purchase?.done && <>It will arrive in <br /> ~1 week!</>}
                            </p>
                        </Col>
                    </Row>
                    <div className="text-center my-4">
                        {purchase?.done ? (
                            <>
                                <button className="btn-primary-lg w-56" onClick={() => setPurchase(undefined)}>BACK TO
                                    STORE
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn-primary-lg w-48 mr-4"
                                    onClick={() => handlePurchase(purchase?._id)}>YES
                                </button>
                                <button className="btn-primary-lg w-48" onClick={() => setPurchase(undefined)}>CANCEL
                                </button>
                            </>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
            <Row>
                <Col md={6}>
                    <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
                        <h2 className="font-medium mb-3">Hello</h2>
                        <p className="text-base">Keep up the amazing work. You are <br /> doing great.</p>
                        <p className="text-sm font-bold">Be honest, be silly, be kind!</p>
                        <div className="text-center">
                            <img className="inline-block" src="/images/hello.svg" alt="" />
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
                        <h4 className="text-primary font-medium mb-3">{time.format('dddd')}</h4>
                        <p className="text-sm font-medium mb-3"
                            style={{ color: '#747474' }}>{time.format('D MMMM YYYY')}</p>
                        <p className="text-sm font-medium mb-3" style={{ color: '#747474' }}>{time.format('hh:mm a')}</p>
                        <div className="text-center">
                            <img className="inline-block" src="/images/sun.svg" alt="" />
                        </div>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="h-full pb-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm mb-8 h-full">
                            <p className="text-lg font-medium">Your Points</p>
                            <div className="flex justify-center items-center mb-12">
                                <img src="/images/star.svg" alt="" />
                                <h2 className="font-bold px-2 text-primary" style={{ fontSize: 60 }}>{user?.points}</h2>
                            </div>
                            <hr />
                            <p className="font-medium text-lg">Your Goal</p>
                            {user?.goal ? (
                                <>
                                    <div className="text-center">
                                        <p className="text-sm font-base font-semibold mb-3 mt-4 text-6D text-center">{user?.goal?.name}</p>
                                        <img src={user?.goal?.image} className="inline-block h-64 mb-4" alt="" />
                                        <Progress
                                            className="mb-4"
                                            strokeColor={{
                                                '0%': '#E02B4C',
                                                '100%': '#FFD075',
                                            }}
                                            strokeWidth={16}
                                            showInfo={false}
                                            percent={user?.points / user?.goal?.cost * 100}
                                        />
                                        {user?.points >= user?.goal?.cost ? (
                                            <>
                                                <p className="text-sm font-medium mb-4 text-7D text-center">
                                                    Congratulation! you have reached your goal<br />
                                                    Keep up the great work!
                                                </p>
                                                <a className="btn-primary-md" onClick={() => setPurchase(user?.goal)}>Buy</a>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-sm font-medium mb-4 text-7D text-center">
                                                    You need {user?.goal?.cost - user?.points} more points for this. <br />
                                                    Keep up the great work!
                                                </p>
                                                <Link href={'/student/wishlist'}>
                                                    <a className="btn-primary-md">Change Goal</a>
                                                </Link>
                                            </>
                                        )}


                                    </div>
                                </>
                            ) : (
                                <div className="text-center">
                                    <img src={'/images/sorry.png'} className="inline-block h-72 mb-4" alt="" />
                                    <p className="text-sm font-medium mb-4 text-7D text-center">You don't have a goal
                                        right now. Try adding <br /> one from your wishlist!</p>
                                    <Link href={'/student/wishlist'}>
                                        <a className="btn-primary-md">Select Goal</a>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
}
Home.layout = StudentLayout
export default Home