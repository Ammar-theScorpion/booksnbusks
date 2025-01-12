import StudentLayout from "../../layouts/student";
import { useUserContext } from "../../contexts/user";
import { FiMinusCircle, FiPlusCircle, FiTrash } from "react-icons/fi";
import swalAlert from "../../components/common/alert";
import { useAction } from "../../helpers/hooks";
import { postPurchase } from "../../helpers/backend_helper";
import { useRouter } from "next/router";
import swal from "sweetalert2";
import Button from '../../components/form/Button.js';

const Checkout = () => {
    const router = useRouter()
    const { cart, addToCart, points, clearCart } = useUserContext()
    let total = cart?.reduce((acc, d) => acc + ((d.cost * d.quantity) || 0), 0)

    const handlePLaceOrder = () => {
        if (points >= total) {
            return useAction(postPurchase, { cart: cart?.map(d => ({ _id: d._id, quantity: d.quantity })) }, () => {
                clearCart()
                router.push('/student/store/')
            })

        } else {
            swal.fire({
                title: 'Oh no!',
                html: `This item is not available to you. You need ${total} amount of points`,
                icon: "warning",
                timer: 100000,
            })
        }
    }

    return (
        <>
            <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
                <h4 className="font-medium mb-3">Checkout</h4>
                {/* yacoob check if there no items */}
                <div>
                    {/* <p className="text-center text-xl mb-3 pb-2">Order Summary</p> */}
                    {cart?.length > 0 ? (
                        <table className="w-full">
                            <tbody>
                                {cart?.map((product, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="px-2">
                                            <img src={product?.image} className="h-14" alt="" />
                                        </td>
                                        <td>
                                            <p className="font-semibold mb-1">{product?.name}</p>
                                        </td>
                                        <td>
                                            <div className="flex items-center">
                                                <FiMinusCircle role="button" size={20} onClick={() => addToCart(product, -1)} />
                                                <span className="mb-0 text-primary pointer-events-none font-bold px-2">
                                                    {product.quantity}
                                                </span>
                                                <FiPlusCircle role="button" size={20} onClick={() => addToCart(product, 1)} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex justify-end items-center">
                                                <p className="mb-0">{product?.cost} Points</p>
                                                <FiTrash
                                                    className="ml-4"
                                                    role="button"
                                                    onClick={() => addToCart(product, -product.quantity)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td>Total</td>
                                    <td></td>
                                    <td></td>
                                    <td className="text-end">
                                        <div className="pr-8 inline-block">{total} Points</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-10">
                            <p className="text-gray-500 text-lg font-semibold">No items here</p>
                            <p className="text-gray-400">Add items to your cart to see them in the summary.</p>
                        </div>
                    )}
                    {cart?.length > 0 && (
                        <div className="flex justify-center mt-4">
                            <Button onClick={handlePLaceOrder}>Place Order</Button>
                        </div>
                    )}
                </div>

            </div>
        </>
    )
}
Checkout.layout = StudentLayout
export default Checkout