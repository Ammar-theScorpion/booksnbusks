import StudentLayout from "../../layouts/student";
import { useAction, useFetch, useWindowSize } from "../../helpers/hooks";
import { fetchProducts, postPurchase, postWishlist } from "../../helpers/backend_helper";
import { Col, Modal, Row } from "react-bootstrap";
import { BsHeartFill, BsSuitHeart } from "react-icons/bs";
import { useUserContext } from "../../contexts/user";
import { useEffect, useState } from "react";
import { swalLoading } from "../../components/common/alert";
import swal from "sweetalert2";
import { notification } from "antd";
import Link from 'next/link'
import Pagination from "../../components/common/pagination";
import { Loading } from "../../components/common/preloader";
import { FiMinus, FiMinusCircle, FiPlay, FiPlus, FiPlusCircle } from "react-icons/fi";
import Button from '../../components/form/Button.js';
import { FaImage } from "react-icons/fa";
import ProductSkeleton from "../../fragment/skeleton/ProductSkeleton.js";

const Store = () => {
    let { width } = useWindowSize()
    const [products, setProducts] = useState()
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
            getProducts(1, size)
        }
    }, [size])

    const getProducts = (page, size) => {
        setLoading(true)
        fetchProducts({ page, size }).then(({ error, data }) => {
            setLoading(false)
            if (error === false) {
                setProducts(data)
            }
        })
    }


    const user = useUserContext()
    const [wish, setWish] = useState()
    const toggleWishlist = async _id => {
        swalLoading()
        let { error, msg } = await postWishlist({ _id })
        swal.close()
        if (error === false) {
            setWish({
                ...wish,
                done: true,
            })
            user.getProfile()
        } else {
            await notification.error({ message: "Error", description: msg })
        }
    }

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


    return (
        <div>
            <Modal show={wish} size="lg" centered>
                <Modal.Body>
                    <Row>
                        <Col md={6} className="text-center">
                            {/* {<img className="h-72 wish-block" src={wish?.image} alt="" />} */}
                            {wish?.image ? <img src={wish?.image} className="inline-block"
                                style={{ maxHeight: '100%' }} alt="" />
                                :
                                <div className="h-72 w-full flex items-center justify-center bg-gray-100 border border-gray-300 ">
                                    <FaImage className="text-gray-400 text-xl" />
                                </div>}
                        </Col>
                        <Col md={6} className="my-auto">
                            {wish?.done ||
                                <p className="text-center text-2xl font-semibold text-5A">{wish?.wishlist ? 'Remove' : 'Add'}</p>}
                            <p className="text-center text-3xl font-semibold">{wish?.name}</p>
                            <p className="text-center text-2xl font-semibold text-5A">
                                {wish?.done ? (
                                    <>has been {wish?.wishlist ? <> removed <br /> from </> : <> added <br /> to</>} your
                                        wishlist!</>
                                ) : (
                                    <>{wish?.wishlist ? 'from' : 'to'} your wishlist?</>
                                )}
                            </p>
                        </Col>
                    </Row>
                    <div className="text-center my-4">
                        {wish?.done ? (
                            <>
                                <Link href="/student/wishlist">
                                    <Button className="w-48">See wishlist</Button>
                                </Link>
                                <Button className="w-48" onClick={() => setWish(undefined)}>Back to store</Button>
                            </>
                        ) : (
                            <>
                                <Button className="w-48" onClick={() => toggleWishlist(wish?._id)}>Yes</Button>
                                <Button className="w-48" onClick={() => setWish(undefined)}>Cancel</Button>
                            </>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={purchase} size="lg" centered>
                <Modal.Body>
                    <Row>
                        <Col md={6} className="text-center">
                            <img className="h-72 inline-block" src={purchase?.image} alt="" />
                        </Col>
                        <Col md={6} className="my-auto">
                            <p className="text-center text-2xl font-semibold text-5A mb-4">
                                {purchase?.done ? "You Purchased" : <>Would you like <br /> to purchase</>}
                            </p>
                            <p className="text-center text-3xl font-semibold">{purchase?.name}</p>
                            <p className="text-center text-2xl font-semibold text-5A">
                                {purchase?.done && <>It will arrive in <br /> ~1 week!</>}
                            </p>
                        </Col>
                    </Row>
                    <div className="text-center my-4">
                        {purchase?.done ? (
                            <>
                                <Button className="w-48" onClick={() => setPurchase(undefined)}>Back to store</Button>
                            </>
                        ) : (
                            <>
                                <Button className="w-48" onClick={() => handlePurchase(purchase?._id)}>Yes</Button>
                                <Button className="w-48" onClick={() => setPurchase(undefined)}>Cancel</Button>
                            </>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
            {/* enhance design */}
            <div className="flex justify-between bg-white p-6 rounded-lg shadow-md items-center mt-8 hover:shadow-xl transition-all mb-5">
                <img className="h-24" src="/images/hello.svg" alt="" />
                <div className="flex flex-wrap justify-center items-center">
                    <h2 className="mr-12 text-3xl my-2">You have</h2>
                    <img className="h-16" src="/images/star.svg" alt="" />
                    <h2 className="font-bold px-2 text-primary text-4xl mb-0">{user?.points}</h2>
                </div>
            </div>
            <>
                {/* fix loading problem  */}
                {loading ? (
                        <ProductSkeleton/>

                ) :

                    <Row>
                        {products?.docs?.map((product, index) => (
                            <Col xxl={3} lg={4} md={6} key={index}>
                                <div className="bg-white p-6 rounded-lg w-full mb-6  shadow-md dark:border-strokedark dark:bg-boxdark">
                                    <div className="h-32 text-center mb-4">

                                        {product?.image ? <img src={product?.image} className="inline-block"
                                            style={{ maxHeight: '100%' }} alt="" />
                                            :
                                            <div className="h-32 w-full flex items-center justify-center bg-gray-100 border border-gray-300 ">
                                                <FaImage className="text-gray-400 text-xl" />
                                            </div>}
                                    </div>
                                    <div className="h-14 mb-2">
                                        <h6 className="font-semibold truncate">{product?.name}</h6>
                                        <h6 className="font-semibold">{product?.cost} Points</h6>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            {user?.cart?.find(d => d._id === product._id) ? (
                                                <div className="flex items-center">
                                                    <FiMinusCircle role="button" size={20} onClick={() => user.addToCart(product, -1)} />
                                                    <span className="mb-0 text-primary pointer-events-none font-bold px-2">{user?.cart?.find(d => d._id === product._id)?.quantity}</span>
                                                    <FiPlusCircle role="button" size={20} onClick={() => user.addToCart(product, 1)} />
                                                </div>
                                            ) : (
                                                <Button className="btn-sm" onClick={() => user.addToCart(product, 1)}>Add To Cart</Button>

                                            )}

                                        </div>
                                        <div className="flex items-center">
                                            {user.isWishlist(product._id) ? (
                                                <BsHeartFill
                                                    className="text-primary cursor-pointer transition-transform hover:scale-110"
                                                    size={24}
                                                    role="button"
                                                    title="Remove from Wishlist"
                                                    onClick={() => setWish({ ...product, wishlist: true })}
                                                />
                                            ) : (
                                                <BsSuitHeart
                                                    className="text-gray-400 cursor-pointer transition-transform hover:scale-110 hover:text-primary"
                                                    size={24}
                                                    role="button"
                                                    title="Add to Wishlist"
                                                    onClick={() => setWish(product)}
                                                />
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                }
                <div className="text-center flex-wrap">
                    <Pagination
                        pageCount={products?.totalPages || 1}
                        page={products?.page || 1}
                        onPageChange={(page) => getProducts(page, size)}
                    />
                </div>

            </>



        </div>
    )
}
Store.layout = StudentLayout
export default Store