import TeacherLayout from "../../../layouts/teacher";
import { useAction, useFetch } from "../../../helpers/hooks";
import {
    fetchAttendance,
    fetchAttendanceElements,
    fetchAttendanceStatus,
    fetchStudents,
    postAttendance,
    fetchClasses,
    fetchUser
} from "../../../helpers/backend_helper";
import Table from "../../../components/common/table";
import { notification, Select } from "antd";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiDelete, FiSearch } from "react-icons/fi";
import { useRouter } from "next/router";
import DateRangeInput from "../../../components/form/date_range";
import moment from "moment";
import Button from "../../../components/form/Button";
import SearchInput from "../../../components/form/search";

const Attendance = () => {
    const [students] = useFetch(fetchStudents);
    const [attendanceStatus, getAttendanceStatus] = useFetch(fetchAttendanceStatus, {}, false);
    let attendanceMap = {};
    attendanceStatus?.forEach((student) => {
        attendanceMap[student._id] = student;
    });

    const [classes] = useFetch(() => fetchAttendanceElements({ award: true }));
    let columns = [
        {
            label: "Student",
            dataIndex: "name",
            formatter: (_, student) => (
                <>
                    {student.first_name} {student.last_name}
                </>
            ),
        },
        {
            label: `Present (${attendanceStatus?.reduce((acc, d) => acc + d.present, 0)})`,
            dataIndex: "_id",
            formatter: (_id) => attendanceMap[_id]?.present || 0,
        },
        {
            label: `Absent (${attendanceStatus?.reduce((acc, d) => acc + d.missed, 0)})`,
            dataIndex: "_id",
            formatter: (_id) => attendanceMap[_id]?.missed || 0,
        },
        {
            label: `Tardy (${attendanceStatus?.reduce((acc, d) => acc + d.tardy, 0)})`,
            dataIndex: "_id",
            formatter: (_id) => attendanceMap[_id]?.tardy || 0,
        },
        {
            label: `Early Dismissal (${attendanceStatus?.reduce((acc, d) => acc + d.left, 0)})`,
            dataIndex: "_id",
            formatter: (_id) => attendanceMap[_id]?.left || 0,
        },
    ];

    const [current, setCurrent] = useState();
    const [filter, setFilter] = useState();
    const [date, setDate] = useState({
        startDate: moment().startOf('day').toDate(),
        endDate: moment().endOf('day').toDate(),
        label: 'Today'
    });
    const [awardPoints, setAwardPoints] = useState(false);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const isSameDay = moment(date.startDate).startOf('day').isSame(moment(date.endDate).startOf('day'))
    useEffect(() => {
        if (isSameDay && classes) {
            let data = classes?.filter(d => d.days.includes(days[moment(date.startDate).day() % 7]))
            if (data?.length === 1) {
                setCurrent(data[0]?._id)
            }
        }
    }, [date, classes]);


    useEffect(() => {
        let data = classes?.find((d) => d._id === current) && classes?.find((d) => d._id === current);;
        if (data) {
            setFilter(data.students);
            if (isSameDay) {
                getClassAttendance()
            } else {
                getAttendanceStatus({
                    class: current,
                    start: moment(date.startDate).format('YYYY-MM-DD'),
                    end: moment(date.endDate).format('YYYY-MM-DD')
                });
            }
        } else {
            setFilter(undefined);
            getAttendanceStatus({
                class: undefined, start: moment(date.startDate).format('YYYY-MM-DD'),
                end: moment(date.endDate).format('YYYY-MM-DD')
            });
        }
    }, [current, date]);

    const [status, setStatus] = useState({});
    const [time, setTime] = useState({});
    const [update, setUpdate] = useState(false);
    const reload = () => setUpdate(!update);



    const getClassAttendance = () => {


        fetchAttendance({ class: current, date: moment(date?.startDate).format("YYYY-MM-DD") }).then(
            ({ error, data }) => {
                let status = {};
                let time = {}
                if (error === false) {
                    data?.map((data) => {
                        status[data?.student] = data.status;
                        time[data?.student] = data.updatedAt;
                        //   getAttendanceStatus({class: current});
                    });
                }
                setStatus(status);
                setTime(time)
            }
        );
    };



    useEffect(() => {
        notification.success({
            message: "Before you begin",
            description: "Select a class, select a date, and you're ready to go!",
        });
    }, []);

    const toggleAttendance = (_id, data) => () => {
        if (status[_id] !== data) {
            setStatus(prevStatus => ({ ...prevStatus, [_id]: data }))
            setTime(prevTime => ({ ...prevTime, [_id]: moment().toISOString() }))
        }
    };

    const updateStatus = async () => {
        // Assuming each student's attendance is a separate document
        for (let studentId in status) {
            await useAction(
                postAttendance,
                {
                    class: current,
                    _id: studentId,
                    status: status[studentId],
                    date: moment(date.startDate)?.format("YYYY-MM-DD"),
                    updatedAt: time[studentId],
                    awardPoints: awardPoints
                },
                () => {
                    getAttendanceStatus()
                },
                false,
                false
            );
        }
        notification.success({
            message: "Success",
            description: "Attendance data has been saved successfully!"
        });
    };

    if (isSameDay && current) {

        columns = [
            {
                label: "Student",
                dataIndex: "name",
                formatter: (_, student) => (
                    <>
                        {student.first_name} {student.last_name}
                    </>
                ),
            },
            {
                label: `Present (${Object.values(status)?.filter(d => d === 1).length})   Absent (${Object.values(status)?.filter(d => d === 2).length})  Tardy (${Object.values(status)?.filter(d => d === 3).length})   Early Dismissal (${Object.values(status)?.filter(d => d === 4).length})`,
                dataIndex: "_",
                formatter: (_, student) => {
                    return (
                        <div>
                            <div className="d-flex">
                                <div
                                    onClick={toggleAttendance(student._id, 1)}
                                    title={status[student._id] === 1 ? moment(attendanceMap[student._id]?.updatedAt).format('hh:mm A') : ""}
                                    className={`btn ${status[student._id] === 1
                                        ? "btn-success"
                                        : "btn-outline-success"
                                        } mx-1`}
                                >
                                    Present
                                </div>
                                <div
                                    onClick={toggleAttendance(student._id, 2)}
                                    title={status[student._id] === 2 ? moment(attendanceMap[student._id]?.updatedAt).format('hh:mm A') : ""}
                                    className={`btn ${status[student._id] === 2
                                        ? "btn-danger"
                                        : "btn-outline-danger"
                                        } mx-1`}
                                >
                                    Absent
                                </div>
                                <div
                                    onClick={toggleAttendance(student._id, 3)}
                                    title={status[student._id] === 3 ? moment(attendanceMap[student._id]?.updatedAt).format('hh:mm A') : ""}
                                    className={`btn ${status[student._id] === 3 ? "btn-dark" : "btn-outline-dark"
                                        } mx-1`}
                                >
                                    Tardy
                                </div>
                                <div
                                    onClick={toggleAttendance(student._id, 4)}
                                    title={status[student._id] === 4 ? moment(attendanceMap[student._id]?.updatedAt).format('hh:mm A') : ""}
                                    className={`btn ${status[student._id] === 4 ? "btn-dark" : "btn-outline-dark"
                                        } mx-1`}
                                >
                                    Early Dismissal
                                </div>

                            </div>
                            <p style={{ marginLeft: ((status[student._id] - 1) || 0) * 90 + 15 }}
                                className={`mb-0 mt-1 text-sm`}>{!!time[student._id] && moment(time[student._id]).format('hh:mm A')}</p>
                        </div>
                    );
                },
            },
        ];
    }

    const [search, setSearch] = useState("");

    const filterFunc = (data) => {
        if (search) {
            if (
                !`${data.first_name} ${data?.last_name}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            ) {
                return false;
            }
        }
        if (filter) {
            return filter?.includes(data._id);
        }
        return true;
    };

    const router = useRouter();

    return (
        <>
            <div className=" print:hidden">
                {/* yacoob remove back */}
                {/* <h4 className="page-title">
                    <FiArrowLeft
                        className="mr-2 inline-block"
                        role="button"
                        onClick={() => router.back()}
                    />
                    Attendance
                </h4> */}

                {/* yacoob change filtering design*/}
                <div className="  relative flex  w-full items-center justify-between">

                    <div className="flex gap-3">
                        <SearchInput value={search} setValue={setSearch} />

                        <div className="flex">
                            <DateRangeInput value={date} onChange={setDate} className="w-44 mr-1" />
                            {isSameDay && (
                                <Select
                                    allowClear
                                    className="w-44 mr-4"
                                    placeholder="Select class"
                                    value={current}
                                    onClear={() => {
                                        setCurrent(undefined);
                                    }}
                                    onChange={setCurrent}
                                    options={classes?.filter(d => d.days.includes(days[moment(date.startDate).day() % 7])).map((d) => ({
                                        label: d.name,
                                        value: d._id
                                    }))}
                                />

                            )}

                        </div>
                        {/* <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={awardPoints}
                                    onChange={(e) => setAwardPoints(e.target.checked)}
                                />
                                <span style={{ fontSize: '0.9rem', fontWeight: '900' }}>Award Points</span>
                            </label>
                        </div> */}
                    </div>
                    <div className="flex justify-center items-center">


                        <div className="flex items-center">
                            <input
                                id="checked-checkbox"
                                type="checkbox"
                                checked={awardPoints}
                                onChange={(e) => setAwardPoints(e.target.checked)}
                                value=""
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                                htmlFor="checked-checkbox"
                                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                                Award Points
                            </label>
                        </div>
                    </div>
                    {/* <FiSearch className="absolute top-2.5 left-2 text-gray-500" />
                    
                    <input
                        className="form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: 30, paddingRight: 30 }}
                        placeholder="Search"
                    /> */}
                    {!!search && (
                        <FiDelete
                            className="absolute right-2 top-3 text-gray-500"
                            role="button"
                            onClick={() => setSearch("")}
                        />
                    )}
                </div>
                <div className="flex justify-between print:hidden  border-t-2 mt-4 pt-3">
                    <div>
                        <Button onClick={() => {
                            window.print()
                        }}>Print
                        </Button>
                        <Button onClick={updateStatus}>Save</Button>

                    </div>



                </div>
            </div>

            <div className="print:absolute print:top-0 print:left-0 print:w-full bg-white">
                <Table
                    columns={columns}
                    data={students
                        ?.filter(filterFunc)
                        ?.sort((a, b) =>
                            a?.last_name
                                ?.toLowerCase()
                                ?.localeCompare(b?.last_name?.toLowerCase())
                        )}
                    noAction
                />
            </div>

        </>
    );
};
Attendance.layout = TeacherLayout;
export default Attendance;
