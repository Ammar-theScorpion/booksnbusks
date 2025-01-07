import TeacherLayout from "../../layouts/teacher";
import {
    fetchPurchases,
    postPurchaseStatus,
} from "../../helpers/backend_helper";
import Table from "../../components/common/table";
import {useActionConfirm, useFetch} from "../../helpers/hooks";
import {BsCheck2Square, BsXSquare} from "react-icons/bs";
import {Select} from "antd";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {FiArrowLeft} from "react-icons/fi";

const Purchases = () => {
    const [purchases, getPurchases, {loading}] = useFetch(
        fetchPurchases,
        {size: 7},
        false
    );
    const statusClass = {
        "Pending Approval": "date-tag day",
        "pending": "date-tag day",
        Fulfilled: "tag-green",
        Approved: "tag-green",
        Unfulfilled: "tag-red",
    };

    const handleUpdateStatus = async (_id, status) => {
        await useActionConfirm(
            postPurchaseStatus,
            {
                _id,
                status,
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
                            <br/>
                        </strong>
                    ))
                ),
        },
        {
            label: "Student",
            dataIndex: "purchased_by",
            formatter: (student) => (
                <div>
                    {student !== undefined && (
                        <>
                            {student?.first_name} {student?.last_name}
                        </>
                    )}
                </div>
            ),
        },
        {
            label: "Status",
            dataIndex: "status",
            formatter: (status) => (
                <div
                    className={`inline-block py-1 px-3 ${statusClass[status]}`}
                >
                    {status}
                </div>
            ),
        },
        /*{
            label: "Approved",
            dataIndex: "approved",
            formatter: (status, dd) => (
                <>
                    {dd?.status === "Pending Approval" && (
                        <>
                            <div
                                className={`inline-block py-1 px-3 text-capitalize ${statusClass[status]}`}
                            >
                                {status}
                            </div>
                        </>
                    )}
                </>
            ),
        },*/
        {
            label: "Approve",
            dataIndex: "action",
            formatter: (_, data) => {
                console.log("Status:", data?.status, "Approved:", data?.approved);
                console.log(data);
                return(
                    <div>
                        {data?.status === "Pending Approval" && data?.approved === 'pending' && (
                            <>
                                <button
                                    onClick={() => handleUpdateStatus(data._id, "Fulfilled")}
                                    className="tag-dark-green px-3 p-1.5 rounded ml-2 mr-2"
                                >
                                    <BsCheck2Square size={20}/>
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(data._id, "Unfulfilled")}
                                    className="tag-dark-red p-1.5 rounded ml-2 mr-2"
                                >
                                    <BsXSquare size={20}/>
                                </button>
                            </>
                        )}
                    </div>
            )},
        },
    ];
    const [status, setStatus] = useState();

    const handleStatusChange = (status) => {
        setStatus(status);
        getPurchases({status, page: 1});
    };
    const router = useRouter();
    useEffect(() => {
        if (router?.query?.status) {
            handleStatusChange(router?.query?.status);
            window.history.pushState(null, null, "/teacher/purchases");
        } else {
            getPurchases();
        }
    }, [router?.query]);

    return (
        <>
            <div className="flex justify-between">
            {/*<h4 className="font-22 font-semibold"><FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()}/> Purchases</h4>*/}
                <div className="flex justify-end items-end mb-2 sm:flex-row flex-col gap-4 top-0 right-0">
                    <Select
                        allowClear
                        onClear={() => handleStatusChange(undefined)}
                        value={status}
                        onSelect={handleStatusChange}
                        placeholder="Status"
                        className="w-44 "
                        options={[
                            {label: "Pending Approval", value: "Pending Approval"},
                            {label: "Fulfilled", value: "Fulfilled"},
                            {label: "Unfulfilled", value: "Unfulfilled"},
                        ]}
                    />
                </div>

            </div>
            <Table
                data={purchases}
                getData={getPurchases}
                columns={columns}
                loading={loading}
                noAction
                pagination
            />
        </>
    );
};
Purchases.layout = TeacherLayout;
export default Purchases;
