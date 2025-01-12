import ParentLayout from "../../../layouts/parent";
import { useActionConfirm, useWindowSize } from "../../../helpers/hooks";
import { useEffect, useState } from "react";
import { fetchPurchases, postPurchaseApprove, postPurchaseStatus } from "../../../helpers/backend_helper";
import { useUserContext } from "../../../contexts/user";
import { BsCheck2Square, BsXSquare } from "react-icons/bs";
import Table from "../../../components/common/table";

const Purchases = () => {
    let { width } = useWindowSize()
    const [purchases, setPurchases] = useState()
    const [loading, setLoading] = useState(true)
    const [size, setSize] = useState(0)

    const user = useUserContext()

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
        fetchPurchases({ page, size, student: user?.student?._id }).then(({ error, data }) => {
            setLoading(false)
            if (error === false) {
                setPurchases(data)
            }
        })
    }

    const statusClass = {
        "Pending Approval": "bg-amber-400",
        Fulfilled: "bg-success",
        Unfulfilled: "bg-primary",
    }

    const handleUpdateStatus = async (_id, status) => {
        await useActionConfirm(
            postPurchaseApprove,
            {
                _id,
                approved: status,
                student: user?.student?._id
            },
            getPurchases,
            `Are you sure want to ${status} the purchase?`,
            `Yes ,${status}`
        );
    };

    const columns = [
        {
            label: "Item Name",
            dataIndex: "product",
            formatter: (product, d) =>
                !!product ? (
                    <strong>{product?.name}</strong>
                ) : (
                    d?.products?.map((product, index) => (
                        <strong key={index}>
                            {product.quantity} {product?.product?.name}
                            <br />
                        </strong>
                    ))
                ),
        },
        {
            label: "Points",
            dataIndex: "cost",
        },
        {
            label: "Status",
            dataIndex: "status",
            formatter: (status) => (
                <div
                    className={`text-white inline-block py-1 px-3 ${statusClass[status]}`}
                >
                    {status}
                </div>
            )
        },
        {
            label: "Approve",
            dataIndex: "action",
            className: "w-48",
            formatter: (_, data) => (
                <div className="flex justify-center">
                    {data?.status === "Pending Approval" && data?.approved === 'pending' && (
                        <>
                            <button
                                onClick={() => handleUpdateStatus(data._id, "Approved")}
                                className="btn-success px-3 p-1.5 rounded ml-2 mr-2"
                            >
                                <BsCheck2Square size={20} />
                            </button>
                            <button
                                onClick={() => handleUpdateStatus(data._id, "Cancelled")}
                                className="btn-primary p-1.5 rounded ml-2 mr-2"
                            >
                                <BsXSquare size={20} />
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Table
                data={purchases}
                getData={getPurchases}
                columns={columns}
                loading={loading}
                noAction
                pagination
            />
        </>
    )
}
Purchases.layout = ParentLayout
export default Purchases