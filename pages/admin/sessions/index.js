import AdminLayout from "../../../layouts/admin";
import {useRouter} from "next/router";
import {useFetch, userOutSideClick} from "../../../helpers/hooks";
import {delProduct, fetchDashboard, fetchUserSessions, getSchools} from "../../../helpers/backend_helper";
import moment from "moment/moment";
import {Select} from "antd";
import {FaGift, FaShoppingBag, FaUsers} from "react-icons/fa";
import {DateRange} from "react-date-range";
import {useEffect, useRef, useState} from "react";
import Table from "../../../components/common/table";

const Sessions = () => {
    const router = useRouter()
    const [schools] = useFetch(getSchools)
    const [data, getData, {loading}] = useFetch(fetchUserSessions, {}, false)
    const [school, setSchool] = useState()
    const [date, setDate] = useState(
        {
            startDate: moment().startOf('month').toDate(),
            endDate: moment().endOf('month').toDate(),
            key: 'selection'
        }
    )

    useEffect(() => {
        getData({
            school,
            start: moment(date?.startDate).startOf('day').toDate(),
            end: moment(date?.endDate)?.endOf('day').toDate()
        })
    }, [school, date])

    let toHHMMSS = (secs) => {
        let sec_num = parseInt(secs, 10)
        let hours   = Math.floor(sec_num / 3600)
        let minutes = Math.floor(sec_num / 60) % 60
        let seconds = sec_num % 60
        return [hours,minutes,seconds]
            .map(v => v < 10 ? "0" + v : v)
            .join(":")
    }

    const getDuration = data => {
        return toHHMMSS(moment.duration(moment(data.endTime).diff(moment(data.createdAt)))._milliseconds / 1000)
    }

    console.log(data)
    const [show, setShow] = useState(false)
    const ref = useRef()
    userOutSideClick(ref, () => setShow(false))

    return (
        <>
            <div className="flex flex-wrap items-center justify-between mb-2">
                {/* Date Range Picker */}
                <div className="relative mr-4 w-full sm:w-auto" ref={ref}>
                    <label className="block text-gray-700 font-medium mb-1">Date Range</label>
                    <div className="flex items-center border border-gray-300 bg-white rounded-lg shadow-sm px-3 py-2 hover:border-blue-500 focus-within:ring focus-within:ring-blue-300">
                        <input
                            className="form-control bg-white w-full text-gray-600 cursor-pointer focus:outline-none"
                            value={`${moment(date?.startDate).format('DD-MM-YYYY')} - ${moment(date?.endDate).format('DD-MM-YYYY')}`}
                            onClick={() => setShow(!show)}
                            readOnly
                        />
                        <span className="ml-2 text-gray-500 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 00-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z" />
                            </svg>
                        </span>
                    </div>
                    <div className={`absolute z-10 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg w-96 ${show ? '' : 'hidden'}`}>
                        <DateRange
                            editableDateInputs={true}
                            onChange={(item) => setDate(item.selection)}
                            moveRangeOnFirstSelection={false}
                            ranges={[date]}
                        />
                    </div>
                </div>

                {/* School Selector */}
                <div className="w-full sm:w-auto">
                    <label className="block text-gray-700 font-medium mb-1">School</label>
                    <Select
                        allowClear
                        className="w-full sm:w-44"
                        placeholder="All Schools"
                        onClear={() => setSchool(undefined)}
                        onChange={setSchool}
                        options={schools?.map((d) => ({ label: d.name, value: d._id } ))}
                        style={{
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            padding: '8px',
                        }}
                    />
                </div>
            </div>

            <Table
                data={data}
                getData={getData}
                columns={[
                    {label: 'Name', dataIndex: 'name',},
                    {label: 'School', dataIndex: 'school',},
                    {
                        label: 'Session Start',
                        dataIndex: 'createdAt',
                        formatter: d => moment(d).format('MM/DD/YYYY HH:mm:ss')
                    },
                    {
                        label: 'Session End',
                        dataIndex: 'endTime',
                        formatter: d => moment(d).format('MM/DD/YYYY HH:mm:ss')
                    },
                    {
                        label: 'Duration',
                        dataIndex: 'endTime',
                        formatter: (_, dd) => getDuration(dd)
                    },
                ]}
                loading={loading}
                pagination
                noAction
            />
        </>
    )
}

Sessions.layout = AdminLayout
export default Sessions