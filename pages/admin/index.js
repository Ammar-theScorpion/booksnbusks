import { useFetch } from "../../helpers/hooks";
import { fetchDashboard, getSchools } from "../../helpers/backend_helper";
import moment from "moment";
import { useRouter } from "next/router";
import AdminLayout from "../../layouts/admin";
import { FaGift, FaShoppingBag, FaUserCog, FaUsers } from "react-icons/fa";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { DateRange } from 'react-date-range';
import Link from "next/link";

const Home = () => {
    const router = useRouter()
    const [schools] = useFetch(getSchools)
    const [dashboard, getDashboard] = useFetch(fetchDashboard, {}, false)
    const [school, setSchool] = useState()
    const [date, setDate] = useState(
        {
            startDate: moment().startOf('month').toDate(),
            endDate: moment().endOf('month').toDate(),
            key: 'selection'
        }
    )

    useEffect(() => {
        getDashboard({
            school,
            start: moment(date?.startDate).startOf('day').toDate(),
            end: moment(date?.endDate)?.endOf('day').toDate()
        })
    }, [school, date])

    return (
        <>
            <div className="flex justify-between mb-2">
                <h5>Dashboard</h5>
                <div className="flex items-center">
                    <Select
                        allowClear
                        className="w-44 mr-4"
                        placeholder="School"
                        onClear={() => setSchool(undefined)}
                        onChange={setSchool}
                        options={schools?.map(d => ({ label: d.name, value: d._id }))} />
                </div>
            </div>
            <div className="row">
                <div className="col-md-7 col-lg-8">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card-counter primary">
                                <FaGift size={32} className="m-3" />
                                <span className="count-numbers">{dashboard?.points || 0}</span>
                                <span className="count-name">Total Award Points</span>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card-counter info">
                                <FaUsers size={32} className="m-3" />
                                <span className="count-numbers">{dashboard?.students || 0}</span>
                                <span className="count-name">Student Awarded</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card-counter success">
                                <FaShoppingBag size={32} className="m-3" />
                                <span className="count-numbers">{dashboard?.products || 0}</span>
                                <span className="count-name">Product Purchased</span>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <Link href={"/admin/sessions"}>
                                <div className="card-counter success" role="button">
                                    <FaUserCog size={32} className="m-3" />
                                    <span className="count-numbers">{dashboard?.logins || 0}</span>
                                    <span className="count-name">Total User Logged In</span>
                                </div>
                            </Link>
                        </div>

                    </div>
                </div>
                <div className="col-md-5 col-lg-4">
                    <DateRange
                        editableDateInputs={true}
                        onChange={item => setDate(item.selection)}
                        moveRangeOnFirstSelection={false}
                        ranges={[date]}
                    />
                </div>
            </div>
        </>
    )
}

Home.layout = AdminLayout
export default Home