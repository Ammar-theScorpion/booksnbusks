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
import { FiArrowLeft, FiChevronLeft } from "react-icons/fi";
import SearchInput from "../../../components/form/search";

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

    if (update) {
        return (
            <>
                <div>
                    <h4 className="font-22 font-semibold"><FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()} /> Edit Class</h4>
                    <hr className="bg-C4" />
                    <Form form={form} layout="vertical" onFinish={handleUpdate}>
                        <HiddenFormItem name="_id" />
                        <FormInput name="name" label="Class Name"
                            placeholder="Enter class name (i.e. ITP 348 Intro to Web Development)" required />
                        <FormInput name="section" label="Section" placeholder="Enter section" />
                        <DaysInput name="days" label="Day(s)" required />
                        <TimeRange name="time" label="Time" required />
                        <FormSelect
                            name="instructors"
                            label="Instructors"
                            initialValue={[]}
                            options={teachers?.map(teacher => ({
                                label: `${teacher?.first_name} ${teacher?.last_name}`,
                                value: teacher?._id
                            }))}
                            isMulti search />
                        <div className="area-select">
                            <FormSelect
                                name="students"
                                label="Students"
                                placeholder="Enter students"
                                initialValue={[]}
                                options={students?.map(student => ({
                                    label: `${student?.first_name} ${student?.last_name}`,
                                    value: student?._id
                                }))}
                                isMulti search />
                        </div>
                        <div className="mt-4">
                            <button className="btn btn-primary mr-4">Save</button>
                            <a className="btn btn-secondary" onClick={() => setUpdate(false)}>Cancel</a>
                        </div>
                    </Form>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="flex justify-between">
                <div>
                    <FiArrowLeft size={28} onClick={() => router.push('/teacher/classes')} role="button"
                        className="mb-3" />
                    <h4 className="page-title">{data?.name}</h4>
                    <p className="text-lg">{data?.section}</p>
                </div>
                <div>
                    {edit && <button className="btn-primary font-semibold rounded-lg w-36" onClick={handleEdit}>Edit
                        Class</button>}
                    {deletePermission &&
                        <button className="btn-primary font-semibold rounded-lg w-36 ml-4" onClick={() => {
                            return useActionConfirm(delClass, { _id: data._id }, () => {
                                return router.push('/teacher/classes')
                            }, 'Are you sure you want to delete this class? This action cannot be undone.', 'Yes, Delete')
                        }}>Delete
                            Class</button>}
                </div>
            </div>
            <div>
                <p className="text-lg mb-0">{data?.days?.map((day, index) => `${index > 0 ? ', ' : ''}${day}`)}</p>
                <p className="text-lg mb-0">{moment(data?.time?.start, 'HH:mm').format('hh:mm a')} -&nbsp;
                    {moment(data?.time?.end, 'HH:mm').format('hh:mm a')}
                </p>
            </div>
            {data?.instructors.length ? (
                <div className="table-responsive mt-4">
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

            <div className="table-responsive mt-4">
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