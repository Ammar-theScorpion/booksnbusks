import TeacherLayout from "../../../layouts/teacher";
import { useAction, useFetch } from "../../../helpers/hooks";
import { fetchClasses, fetchTraits, postAwards } from "../../../helpers/backend_helper";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { Form } from "antd";
import FormSelect from "../../../components/form/FormSelect";
import FormInput from "../../../components/form/FormInput";
import moment from "moment";
import { useRouter } from "next/router";
import Button from "../../../components/form/Button";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

const Award = () => {
    const [form] = Form.useForm()
    const [classes, getClasses] = useFetch(() => fetchClasses({ award: true, students: true }));
    const [selected, setSelected] = useState({})
    const [award, setAward] = useState(false)
    const [update, setUpdate] = useState(false)

    const [traits] = useFetch(fetchTraits)

    const students = {}
    const classNames = {}
    classes?.sort((a, b) => a.name.localeCompare(b.name)).forEach(data => {
        console.log("ds", classes)
        classNames[data._id] = data.name
        data?.students?.forEach(student => {
            students[student._id] = student
        })
    })

    const handleStudentSelect = (e, student, school) => {
        if (e.target.checked === true) {

        } else {
            selected[school] = selected[school]?.filter(data => data !== student)
        }
        setUpdate(!update)
    }

    const router = useRouter()
    const isSelected = Object.values(selected).find(data => data?.length > 0)
    const handleAward = async values => {
        if (isSelected) {
            await useAction(postAwards, { ...values, classes: selected, date: moment().toISOString(true) }, () => {
                router.push('/teacher/students/')
            })
        }
    }

    if (award) {
        return (
            <>
                <Form layout="vertical" form={form} className="mt-4" onFinish={handleAward}>
                    <FormSelect
                        name="trait"
                        label="Virtue"
                        onSelect={value => form.setFieldsValue({ amount: traits?.find(trait => trait._id === value)?.points || 0 })}
                        options={traits?.map(trait => ({ label: trait.name, value: trait._id }))} required />
                    <FormInput name="amount" label="Amount" required readOnly />
                    {Object.keys(selected)?.filter(key => selected[key]?.length > 0).map((key, index) => (
                        <div key={index}>
                            <h4 className="page-title">Students - {classNames[key]}</h4>
                            <ul className="p-0">
                                {selected[key]?.map((select, index) => (
                                    <li key={index} className="p-3  flex justify-between">
                                        <span
                                            className="text-lg">{students[select]?.first_name} {students[select]?.last_name}</span>
                                        <input type="checkbox" onChange={e => handleStudentSelect(e, select, key)}
                                            checked={selected[key]?.includes(students[select]?._id)} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {!!isSelected || <p className="text-danger text-lg font-semibold">No Student selected</p>}
                    <div className="mt-4">
                        <button className="btn btn-primary mr-4">Save</button>
                        <a className="btn btn-secondary" onClick={() => setAward(false)}>Cancel</a>
                    </div>
                </Form>
            </>
        )
    }

    console.log(Object.keys(classNames).length) // space-y-8 p-6
    return (
        (Object.keys(classNames).length === 0) ?
            <>
                <div className="flex flex-col items-center justify-center">
                    {/* Empty Awards Message */}
                    <div className="text-center">
                        <div className="text-blue-500 text-6xl mt-44">
                            <i className="fas fa-gift-open"></i> {/* Font Awesome Opened Gift Icon */}
                        </div>
                        <p className="text-xl font-semibold text-gray-700 mt-4">
                            No Awards Yet
                        </p>
                        <p className="text-gray-500 text-center max-w-md mt-2">
                            It looks like no awards have been given yet. Start recognizing achievements by adding awards!
                        </p>
                    </div>

                    {/* Add Award Button */}


                    <Button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-transform transform active:scale-95" onClick={() => setAward(true)}>Reward</Button>
                </div>
            </>
            : (
                <div className="">
                    {/* yacoob remove back */}
                    {/* <h4 className="font-22 font-semibold"><FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()} /> Award</h4> */}
                    <div className="flex justify-between">
                        <div>

                        </div>
                        <div>
                            <Button onClick={() => setAward(true)}>Reward</Button>
                        </div>
                    </div>
                    <table className=" mt-4 w-full bg-red-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 pr-3">
                            <tr>
                                <th className="p-3  w-1/3 ">Classes</th>
                                <th className="text-center p-3 w-1/4">Select</th>
                                <th className="text-center p-3 w-1/4">Awards</th>
                            </tr>
                        </thead>
                        <tbody className="bg-black">

                            {classes?.map((data, index) => (
                                <ClassRow
                                    data={data}
                                    selected={selected}
                                    setSelected={setSelected}
                                    reload={() => setUpdate(!update)}
                                    key={index}
                                />
                            ))}
                        </tbody>
                    </table>

                </div>)
    )
}
Award.layout = TeacherLayout
export default Award

const ClassRow = ({ data, selected, setSelected, reload }) => {
    const ref = useRef()
    const [show, setShow] = useState(false)

    const handleClassSelect = e => {
        if (e.target.checked === true) {
            selected[data._id] = data.students?.map(student => student._id)
        } else {
            selected[data._id] = []
        }
        reload()
    }
    const handleStudentSelect = (e, student) => {
        if (e.target.checked === true) {
            let checked = selected[data._id] || []
            checked.push(student._id)
            selected[data._id] = checked
        } else {
            selected[data._id] = selected[data._id]?.filter(data => data !== student._id)
        }
        reload()
    }

    let isClassChecked = selected[data._id]?.length === data?.students?.length
    let isAnyStudentChecked = selected[data._id]?.length > 0

    useEffect(() => {
        if (ref?.current) {
            ref.current.indeterminate = isAnyStudentChecked && !isClassChecked
        }
    }, [isAnyStudentChecked, isClassChecked])


    return (
        <>
            <tr className=" odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800  p-3 shadow-md" >
                <td className="font-semibold p-3" role="button" onClick={() => setShow(!show)}>
                    {show ? <FiChevronDown className="inline-block mr-4" size={20} /> :
                        <FiChevronRight className="inline-block mr-4" size={20} />}
                    {data?.name}
                </td>
                <td className="flex justify-center items-center border-none mt-2 p-3">

                    <input type="checkbox" ref={ref} onChange={handleClassSelect} checked={isClassChecked} />
                </td>
                <td className="p-3">
                    <span className="w-40 m-auto text-white hover:cursor-pointer bg-gradient-to-r from-indigo-400 to-purple-500 hover:scale-105 transition-all duration-500 flex  justify-center items-start p-2 rounded-lg shadow-md hover:shadow-lg"
                    >
                        {data?.students.length} Awards
                    </span>

                </td>
            </tr>

            {show && data?.students?.map((student, index) => (
                <tr key={index} className="bg-white shadow-inner ">
                    <td className="w-1/3 pl-1 p-2"> {student?.first_name} {student?.last_name}</td>
                    <td className="text-center w-1/4">
                        <input
                            type="checkbox"
                            onChange={(e) => handleStudentSelect(e, student)}
                            checked={selected[data._id]?.includes(student._id) || false}
                        />
                    </td>
                    <td className="w-1/4 text-center">
                        {student?.last_rewarded && moment(student?.last_rewarded).fromNow()}
                    </td>
                </tr>
            ))}

        </>


    )
}