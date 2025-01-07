import TeacherLayout from "../../../layouts/teacher";
import Link from 'next/link'
import { checkPermission, useAction, useActionConfirm, useFetch } from "../../../helpers/hooks";
import { fetchClasses, fetchTraits, postAttendance, postAwards } from "../../../helpers/backend_helper";
import moment from "moment";
import { useRouter } from "next/router";
import { FiArrowLeft, FiCalendar, FiChevronDown, FiChevronUp, FiClipboard, FiGift } from "react-icons/fi";
import SearchInput from "../../../components/form/search";
import { useState } from "react";
import { Form, Modal } from "antd";

const Classes = () => {
    const router = useRouter()
    const [classes, getClasses] = useFetch(fetchClasses, { mine: true }, { date: moment().format('YYYY-MM-DD') })
    const [traits] = useFetch(fetchTraits)
    const nameFormat = (_, data) => {
        return (
            <>
                <p role="button" className="text-lg font-semibold mb-0">{data?.name}</p>
                <p>{data?.section}</p>
            </>
        )
    }

    const timeFormat = (_, data) => {
        return (
            <>
                <p className="text-lg mb-0">{data?.days?.map((day, index) => `${index > 0 ? ', ' : ''}${day}`)}</p>
                <p className="text-lg mb-0">{moment(data?.time?.start, 'HH:mm').format('hh:mm a')} -&nbsp;
                    {moment(data?.time?.end, 'HH:mm').format('hh:mm a')}
                </p>
            </>
        )
    }


    const add = checkPermission('class_create')
    const [search, setSearch] = useState('')
    return (
        <>
            <div className="flex justify-between">
                <h4>
                    <FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()} /> Classes
                </h4>
                <div className="flex">
                    {(classes?.length > 0) && (<SearchInput value={search} setValue={setSearch} />)}

                    {/* {add && (
                        <Link href="/teacher/classes/create">
                            <Button>Add Class</Button>
                        </Link>
                    )} */}
                </div>
            </div>
            <div className="pr-2">
                <div>
                    {classes?.length === 0 && (
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <div className="w-64 h-64 border-2 border-gray-300 rounded-lg">
                                <div className="grid grid-cols-5 grid-rows-5 h-full w-full">
                                    <div className="border-b border-r border-gray-300 col-span-5 text-center font-semibold text-gray-700">Time / Class</div>
                                    <div className="border-b border-r border-gray-300 text-center">9:00 AM</div>
                                    <div className="border-b border-r border-gray-300 text-center">10:00 AM</div>
                                    <div className="border-b border-r border-gray-300 text-center">11:00 AM</div>
                                    <div className="border-b border-r border-gray-300 text-center">12:00 PM</div>
                                    <div className="border-b border-r border-gray-300 text-center">1:00 PM</div>

                                    <div className="border-b border-r border-gray-300 text-center">Class 1</div>
                                    <div className="border-b border-r border-gray-300 text-center"></div>
                                    <div className="border-b border-r border-gray-300 text-center"></div>
                                    <div className="border-b border-r border-gray-300 text-center"></div>
                                    <div className="border-b border-r border-gray-300 text-center"></div>
                                </div>
                            </div>

                            <p className="text-xl font-semibold text-gray-700">Your Classes are Empty</p>
                            <p className="text-gray-500 text-center max-w-md">
                                It looks like you don't have any scheduled classes right now. Add new classes to fill up your schedule!
                            </p>
                            {add && (
                                <Link href="/teacher/classes/create">
                                    <button type="button" className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-transform transform active:scale-95">
                                        Add Class
                                    </button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
                {classes?.filter(d => d.name.toLowerCase()?.includes(search.toLowerCase())).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))?.map((d, index) => (
                    <ClassCard data={d} key={index} traits={traits} getClasses={getClasses} />
                ))}
            </div>

        </>

    )
}

Classes.layout = TeacherLayout
export default Classes


const ClassCard = ({ data, traits, getClasses }) => {
    const [show, setShow] = useState(false)
    const [showAward, setShowAward] = useState(false)
    const [showPresent, setShowPresent] = useState(false)
    const [showAbsent, setShowAbsent] = useState(false)
    const [awardForm] = Form.useForm()
    const [presentForm] = Form.useForm()
    const [absentForm] = Form.useForm()

    const [absences, setAbsences] = useState([])
    const [tardies, setTardies] = useState([])
    const [lefts, setLefts] = useState([])

    return (
        <div className="bg-white rounded my-4">
            <div className="flex flex-col md:flex-row flex-wrap justify-between p-4 pb-0">
                <div className="!text-center md:!text-left">
                    <div className="flex">
                        <h5 className="font-semibold ">{data?.name}</h5>
                        <Link href={'/teacher/classes/' + data._id}>
                            <a className="ml-2 mt-1 text-blue-300 hover:underline" style={{ fontSize: '0.7rem' }}>See Details</a>
                        </Link>
                    </div>
                    <p className="mb-1 text-sm">{data?.section}</p>
                    <p className="mb-1">Instructors</p>
                    {data?.instructors?.map((d, index) => (
                        <p className="mb-1 text-sm" key={index}>{d?.first_name} {d?.last_name} ({d?.email})</p>
                    ))}
                </div>
                <hr className="my-2 md:hidden" />
                <div className="!text-center md:!text-right">
                    <p className="mb-0">{data?.days?.map((day, index) => `${index > 0 ? ', ' : ''}${day}`)}</p>
                    <p className="mb-0">{moment(data?.time?.start, 'HH:mm').format('hh:mm a')} -&nbsp;
                        {moment(data?.time?.end, 'HH:mm').format('hh:mm a')}
                    </p>
                    <div className="bg-gray-600 inline-block px-2 py-1 rounded-full text-sm text-white my-1">
                        Students Enrolled <span
                            className="bg-white text-gray-700 rounded-full px-1 font-semibold">{data?.students?.length}</span>
                    </div>
                </div>
            </div>
            <div className="text-end px-4 pt-0 pb-3">
                <a className="py-1.5 text-decoration-none" onClick={() => setShow(!show)}>
                    View Attendance
                    {show ? <FiChevronDown className="inline-block ml-1" /> :
                        <FiChevronUp className="inline-block ml-1" />}
                </a>
            </div>
            {show && (
                <>
                    <div className="bg-gray-50 rounded-b border border-gray-400">
                        <div className="flex justify-between flex-wrap !px-2 md:!px-4 py-2.5 border-t border-gray-400">
                            <div className="flex items-center ">
                                <FiCalendar size={20} className="mr-2 mb-2 md:mb-0" />
                                <span>Attendance</span>
                            </div>
                            <div className="flex flex-wrap items-center">
                                <div
                                    className="flex border-2 border-green-600 bg-green-600 rounded overflow-hidden mr-3 mb-2 md:mb-0">
                                    <so className="text-white px-2">Present</so>
                                    <div
                                        className="text-green-600 bg-white px-2">{data?.attendances?.find(d => d._id === 1)?.total || 0}</div>
                                </div>
                                <div
                                    className="flex border-2 border-red-500 bg-red-500 rounded overflow-hidden mr-3 mb-2 md:mb-0">
                                    <so className="text-white px-2">Absent</so>
                                    <div
                                        className="text-red-500 bg-white px-2">{data?.attendances?.find(d => d._id === 2)?.total || 0}</div>
                                </div>
                                <div
                                    className="flex border-2 border-gray-500 bg-gray-500 rounded overflow-hidden mr-3 mb-2 md:mb-0">
                                    <so className="text-white px-2">Tardy</so>
                                    <div
                                        className="text-gray-500 bg-white px-2">{data?.attendances?.find(d => d._id === 3)?.total || 0}</div>
                                </div>
                                <div
                                    className="flex border-2 border-gray-500 bg-gray-500 rounded overflow-hidden mr-3 mb-2 md:mb-0">
                                    <so className="text-white px-2">Early Dismissal</so>
                                    <div
                                        className="text-gray-500 bg-white px-2">{data?.attendances?.find(d => d._id === 4)?.total || 0}</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}