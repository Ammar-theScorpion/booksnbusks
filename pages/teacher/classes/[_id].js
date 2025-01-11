import TeacherLayout from "../../../layouts/teacher";
import { useRouter } from "next/router";
import { checkPermission, useAction, useActionConfirm, useFetch } from "../../../helpers/hooks";
import {
    delClass,
    fetchClass,
    fetchStudents,
    fetchTeachers, fetchTraits,
    postAward,
    postClass,
    postClassUpdate
} from "../../../helpers/backend_helper";
import moment from "moment";
import { Form, Modal } from "antd";
import React, { useState } from "react";
import FormInput, { HiddenFormItem } from "../../../components/form/FormInput";
import DaysInput from "../../../components/form/DaysInput";
import TimeRange from "../../../components/form/TimeRange";
import FormSelect from "../../../components/form/FormSelect";
import Link from "next/link";
import { FiArrowLeft, FiChevronLeft, FiEdit, FiTrash2 } from "react-icons/fi";
import SearchInput from "../../../components/form/search";
import TableSkeleton from "../../../fragment/skeleton/TableSkeleton";

const Class = () => {
    const router = useRouter()
    const [form] = Form.useForm()
    const [update, setUpdate] = useState(false)
    const [data, getData] = useFetch(fetchClass, { _id: router.query?._id })

    const [form2] = Form.useForm()
    const [visible, setVisible] = useState(false)

    const [students] = useFetch(fetchStudents)
    const [teachers] = useFetch(fetchTeachers)

    const handleEdit = () => {
        form.resetFields()
        form.setFieldsValue({
            ...data,
            students: data?.students?.map(student => student._id),
            instructors: data?.instructors?.map(instructor => instructor._id)
        })
        setUpdate(true)
    }

    const handleUpdate = async values => {
        await useAction(postClassUpdate, values, () => {
            getData()
            setUpdate(false)
        })
    }
    const edit = checkPermission('class_edit')
    const deletePermission = checkPermission('class_delete')
    const award_student = checkPermission('roster_award_student')
    const [traits] = useFetch(fetchTraits)
    const [search, setSearch] = useState('')
    console.log(data?.time?.start, data?.time?.end);
    if (!traits || !data || !students || !teachers) {
        return <TableSkeleton columnCount={4} pagination={false} rowCount={10} />
    }
    if (update) {
        return (
            <>
                <div className="bg-gray-50 shadow-lg rounded-xl p-8 max-w-3xl mx-auto">
                    {/* Header Section */}
                    <div className="flex items-center mb-8">
                        <FiArrowLeft
                            className="text-gray-700 hover:text-blue-600 cursor-pointer mr-3"
                            size={24}
                            onClick={() => setUpdate(false)}
                        />
                        <h4 className="text-2xl font-semibold text-gray-800">Edit Class</h4>
                    </div>
                    <hr className="border-gray-300 mb-8" />

                    {/* Form Section */}
                    <Form form={form} layout="vertical" onFinish={handleUpdate}>
                        <HiddenFormItem name="_id" />

                        <FormInput
                            name="name"
                            label="Class Name"
                            placeholder="Enter class name (e.g., ITP 348 Intro to Web Development)"
                            required
                            className="mb-6"
                        />
                        <FormInput
                            name="section"
                            label="Section"
                            placeholder="Enter section"
                            className="mb-6"
                        />
                        <DaysInput
                            name="days"
                            label="Day(s)"
                            required
                            className="mb-6"
                        />
                        <TimeRange
                            name="time"
                            label="Time"
                            required
                            className="mb-6"
                        />

                        {/* Instructor Selector */}
                        <FormSelect
                            name="instructors"
                            label="Instructors"
                            initialValue={[]}
                            options={teachers?.map((teacher) => ({
                                label: `${teacher?.first_name} ${teacher?.last_name}`,
                                value: teacher?._id,
                            }))}
                            isMulti
                            search
                            className="mb-6"
                        />

                        {/* Student Selector */}
                        <FormSelect
                            name="students"
                            label="Students"
                            placeholder="Enter students"
                            initialValue={[]}
                            options={students?.map((student) => ({
                                label: `${student?.first_name} ${student?.last_name}`,
                                value: student?._id,
                            }))}
                            isMulti
                            search
                            className="area-select">
                        </FormSelect>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between gap-4 ">
                            <button className="btn-primary px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-200">
                                Save
                            </button>
                            <button
                                className="btn-secondary px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-300 hover:bg-gray-400 shadow-sm transition-all duration-200"
                                onClick={() => setUpdate(false)}
                                type="button"
                            >
                                Cancel
                            </button>
                        </div>
                    </Form>
                </div>
            </>
        );
    }




    return (
        <>
            <div className="flex justify-between">
                <div>
                    <FiArrowLeft size={28} onClick={() => router.back()} role="button"
                        className="mb-3" />
                    <h4 className="page-title">{data?.name}</h4>
                    <p className="text-lg">{data?.section}</p>
                </div>
                <div>
                    {edit && (
                        <button
                            className="bg-white font-semibold rounded-lg w-36 ml-4 py-2 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                            onClick={handleEdit}
                        >
                            <span className="flex items-center justify-center">
                                <FiEdit className="mr-2" size={18} />
                                Edit Class
                            </span>

                        </button>
                    )}

                    {deletePermission &&
                        <button
                            className="bg-white font-semibold rounded-lg w-36 ml-4 py-2 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                            onClick={() => {
                                return useActionConfirm(
                                    delClass,
                                    { _id: data._id },
                                    () => {
                                        return router.push('/teacher/classes');
                                    },
                                    'Are you sure you want to delete this class? This action cannot be undone.',
                                    'Yes, Delete'
                                );
                            }}
                        >
                            <span className="flex items-center justify-center">
                                <FiTrash2 className="mr-2" size={18} />
                                Delete Class
                            </span>
                        </button>
                    }
                </div>
            </div>
            <div>
                <p className="text-lg mb-0">
                    {data?.days?.map((day, index) => (
                        <span key={index} className="p-2 shadow-md bg-white rounded-md mr-2">

                            {day}
                        </span>
                    ))}
                </p>
                <p className="text-lg mb-0 flex items-center space-x-2 mt-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-medium rounded-md shadow">
                        {moment(data?.time?.start, 'HH:mm').format('hh:mm a')}
                    </span>
                    <span className="text-gray-500 font-semibold">to</span>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-medium rounded-md shadow">
                        {moment(data?.time?.end, 'HH:mm').format('hh:mm a')}
                    </span>
                </p>

            </div>
            {data?.instructors.length ? (
                <div className="mt-4 h-screen">
                    <table className="table mt-2 text-sm text-gray-500 dark:text-gray-400 overflow-y-auto w-full ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Instructor</th>
                                <th className="px-6 py-3 text-center">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.instructors?.sort((a, b) => a?.last_name?.toLowerCase()?.localeCompare(b?.last_name?.toLowerCase())).map((instructor, index) => (
                                <tr className=" odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={index}>

                                    <td className="px-6 py-3 flex flex-row">{instructor?.first_name || ''} {instructor?.last_name || ''}</td>
                                    <td className="tpx-6 py-3 text-center">{instructor?.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <h5> No Instructors for this class</h5>
            )
            }

            <div className=" mt-4">
                <SearchInput value={search} setValue={setSearch} />

                <table className="table mt-2 text-sm text-gray-500 dark:text-gray-400 overflow-y-auto w-full ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">


                        <tr>
                            <th>Student</th>
                            <th className="px-6 py-3 text-center bg-F8">Current Balance</th>
                            <th className="px-6 py-3 text-center">Parent's Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.students?.filter(d => `${d?.first_name} ${d?.last_name}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a?.last_name?.toLowerCase()?.localeCompare(b?.last_name?.toLowerCase())).map((student, index) => (
                            <tr className=" odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={index}>

                                <td className="px-6 py-3 flex flex-row"><a onClick={() => {
                                    if (award_student) {
                                        form2.resetFields()
                                        form2.setFieldsValue({ student: student._id })
                                        setVisible(true)
                                    }
                                }}>{student?.first_name} {student?.last_name}</a></td>
                                <td className="px-6 py-3 text-center">{student?.points}</td>
                                <td className="px-6 py-3 text-center">{student?.guardian_email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal visible={visible} title="Award" footer={null} onCancel={() => setVisible(false)}>
                <Form layout="vertical" form={form2} onFinish={values => {
                    return useAction(postAward, { ...values }, () => {
                        setVisible(false)
                        getData()
                    })
                }}>
                    <Form.Item name="student" initialValue="" hidden><input /></Form.Item>
                    <FormSelect
                        name="trait"
                        label="Virtue"
                        onSelect={value => form.setFieldsValue({ amount: traits?.find(trait => trait._id === value)?.points || 0 })}
                        options={traits?.map(trait => ({ label: trait.name, value: trait._id }))} required />
                    <FormInput name="amount" label="Amount" required />
                    <button className="btn-primary mt-2">Submit</button>
                </Form>
            </Modal>
        </>
    )
}
Class.layout = TeacherLayout
export default Class