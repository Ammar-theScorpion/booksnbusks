import AdminLayout from "../../../layouts/admin";
import { useRouter } from "next/router";
import { useFetch, userOutSideClick } from "../../../helpers/hooks";
import { delProduct, fetchDashboard, fetchUserSessions, getSchools } from "../../../helpers/backend_helper";
import moment from "moment/moment";
import { Select } from "antd";
import { FaGift, FaShoppingBag, FaUsers } from "react-icons/fa";
import { DateRange } from "react-date-range";
import { useEffect, useRef, useState } from "react";
import Table from "../../../components/common/table";

const Sessions = () => {
    const router = useRouter()
    const [schools] = useFetch(getSchools)
    const [data, getData, { loading }] = useFetch(fetchUserSessions, {}, false)
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
        let hours = Math.floor(sec_num / 3600)
        let minutes = Math.floor(sec_num / 60) % 60
        let seconds = sec_num % 60
        return [hours, minutes, seconds]
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
        // enhance design 
        <div className=" pt-28 h-screen">
            <div className="flex flex-1 mb-4 items-center bg-white p-6 rounded-xl shadow-md border border-gray-200 space-x-6">
                {/* Date Range Picker */}
                <div className="relative w-72" ref={ref}>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Select Date Range</label>
                    <div
                        className="relative flex items-center bg-gray-50 border border-gray-300 rounded-lg p-2 cursor-pointer hover:border-gray-400 focus-within:ring-2 focus-within:ring-primary"
                        onClick={() => setShow(!show)}
                    >
                        <span className="text-gray-600 text-sm">
                            {`${moment(date?.startDate).format('DD-MM-YYYY')} - ${moment(date?.endDate).format('DD-MM-YYYY')}`}
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 ml-auto text-gray-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    {show && (
                        <div
                            className="absolute top-14 left-0 z-50 bg-white shadow-lg rounded-lg p-4 w-full"
                            style={{ maxHeight: '400px', overflowY: 'auto' }}
                        >
                            <DateRange
                                editableDateInputs={true}
                                onChange={(item) => setDate(item.selection)}
                                moveRangeOnFirstSelection={false}
                                ranges={[date]}
                            />
                        </div>
                    )}
                </div>

                {/* School Selector */}
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Select School</label>
                    <Select
                        allowClear
                        className="w-full"
                        placeholder="Choose a School"
                        onClear={() => setSchool(undefined)}
                        onChange={setSchool}
                        options={schools?.map((d) => ({ label: d.name, value: d._id }))}
                        style={{
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB',
                            fontSize: '14px',
                            padding: '4px',
                            color: '#4B5563',
                        }}
                    />
                </div>
            </div>

            <div >
                <Table
                    data={data}
                    getData={getData}
                    columns={[
                        { label: 'Name', dataIndex: 'name', },
                        { label: 'School', dataIndex: 'school', },
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
            </div>

        </div>
    )
}

Sessions.layout = AdminLayout
export default Sessions