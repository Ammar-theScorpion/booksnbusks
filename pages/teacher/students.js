import { checkPermission, useAction, useActionConfirm, useFetch } from "../../helpers/hooks";
import {
    deleteStudent,
    fetchAwards,
    fetchStudents,
    fetchTraits,
    postAward,
    updateStudent
} from "../../helpers/backend_helper";
import { Table } from "react-bootstrap";
import TeacherLayout from "../../layouts/teacher";
import { Form, Modal } from "antd";
import React, { useEffect, useState } from "react";
import FormSelect from "../../components/form/FormSelect";
import FormInput from "../../components/form/FormInput";
import { FiArrowLeft, FiEdit, FiGift, FiTrash } from "react-icons/fi";
import { useRouter } from "next/router";
import SearchInput from "../../components/form/search";
import { FaExclamationCircle, FaHistory } from "react-icons/fa";
import moment from "moment/moment";
import Pagination from "../../components/common/pagination";
import TableSkeleton from "../../fragment/skeleton/TableSkeleton";
import HistoryAwardSkeleton from "../../fragment/skeleton/HistoryAwardSkeleton";

const Students = () => {
    const [form] = Form.useForm()
    const [form2] = Form.useForm()
    const [search, setSearch] = useState('')
    const [visible, setVisible] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [student, setStudent] = useState()
    const [students, getStudents, { loading: studentLoading }] = useFetch(fetchStudents)
    const router = useRouter()
    const award_student = checkPermission('roster_award_student')
    const delete_student = checkPermission('roster_delete_student')
    const edit_student = checkPermission('roster_edit_student', true)

    const [traits] = useFetch(fetchTraits)

    const [history, getHistory, { loading }] = useFetch(fetchAwards, { size: 5 }, false)
    useEffect(() => {
        if (!!student) {
            getHistory({ _id: student?._id })
        }
    }, [student])


    return (
        <>
            <div className="flex justify-between mb-3">
                <h4 className="page-title"><FiArrowLeft className="mr-2 inline-block" role="button"
                    onClick={() => router.back()} /> Student Roster</h4>
                <SearchInput value={search} setValue={setSearch} />
            </div>

            <Modal visible={visible} title="Award" footer={null} onCancel={() => setVisible(false)}>
                <Form layout="vertical" form={form} onFinish={values => {
                    return useAction(postAward, { ...values }, () => {
                        setVisible(false)
                        getStudents()
                    })
                }}>
                    <Form.Item name="student" initialValue="" hidden><input /></Form.Item>
                    <FormSelect
                        name="trait"
                        label="Virtue"
                        onSelect={value => form.setFieldsValue({ amount: traits?.find(trait => trait._id === value)?.points || 0 })}
                        options={traits?.map(trait => ({ label: trait.name, value: trait._id }))} required />
                    <FormInput name="amount" label="Amount" required readOnly />
                    <button className="btn-primary mt-2">Submit</button>
                </Form>
            </Modal>

            <Modal visible={visible2} title="Edit Student" footer={null} onCancel={() => setVisible2(false)}>
                <Form layout="vertical" form={form2} onFinish={values => {
                    return useAction(updateStudent, { ...values }, () => {
                        setVisible2(false)
                        getStudents()
                    })
                }}>
                    <Form.Item name="_id" initialValue="" hidden><input /></Form.Item>
                    <FormInput name="first_name" label="First Name" required />
                    <FormInput name="last_name" label="Last Name" required />
                    <FormInput name="points" label="Points" type="number" required />
                    <button className="btn-primary mt-2">Submit</button>
                </Form>
            </Modal>

            <Modal
                visible={!!student}
                onCancel={() => setStudent(undefined)}
                title="Award History"
                style={{ top: 15, maxHeight: '95vh' }}
                width={800}
                footer={null}
                bodyStyle={{
                    padding: 0,
                    minHeight: '80vh',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}>

                {loading ? <HistoryAwardSkeleton /> : (
                    <>
                        <div className="px-6 py-4 space-y-6">
                            <ul className="space-y-6">
                                {history?.docs?.map((award, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg transition-transform hover:scale-105"
                                    >
                                        {/* Points */}
                                        <span className="text-primary-primary oswald text-4xl font-bold">
                                            +{award?.points}
                                        </span>

                                        {/* Details */}
                                        <div className="text-right flex-1 pl-4">
                                            <p className="text-lg font-semibold text-gray-800 mb-1">
                                                {award?.class?.name}
                                                <span className="text-sm text-gray-500 ml-2">
                                                    {moment(award?.createdAt).format('MMM DD, YYYY')}
                                                </span>
                                            </p>
                                            <p className="text-base text-gray-600 mb-1">
                                                <span className="font-medium">By: </span>
                                                {award?.award_by?.first_name} {award?.award_by?.last_name}
                                            </p>
                                            <p className="text-sm text-indigo-500 font-medium">
                                                {award?.trait?.name}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Fixed Pagination */}
                        {history?.docs?.length > 0 ? (
                            <div className="text-center border-t border-gray-200 p-4 sticky bottom-0 bg-white">
                                <Pagination
                                    page={history?.page || 1}
                                    pageCount={history?.totalPages || 1}
                                    onPageChange={page => getHistory({ page })}
                                />
                            </div>
                        ) :
                            <div className="px-6 py-8 space-y-6 flex flex-col items-center bg-gray-50 rounded-lg shadow-inner mx-4">
                                {/* Icon */}
                                <div className="flex items-center justify-center bg-gray-100 text-gray-400 rounded-full w-16 h-16 mb-4">
                                    <FaExclamationCircle className="w-8 h-8" />
                                </div>

                                {/* Message */}
                                <p className="text-center text-gray-700 text-lg font-medium">
                                    No Awards Found
                                </p>
                                <p className="text-center text-gray-500 text-sm">
                                    This student hasn't received any awards yet. Encourage them to achieve their best!
                                </p>

                                {/* Button (Optional Action) */}
                                <button
                                    className="mt-4 bg-primary-primary text-white px-6 py-2 rounded-md shadow hover:bg-primary-dark transition"
                                    onClick={() => {
                                        form.resetFields()
                                        form.setFieldsValue({
                                            student: student._id
                                        })
                                        setVisible(true)
                                    }} // Add an appropriate action handler if needed
                                >
                                    Add an Award
                                </button>
                            </div>

                        }
                    </>
                )}

            </Modal>
            {studentLoading ? <TableSkeleton columnCount={4} pagination={false} rowCount={10} /> : (
                <table className="table-auto text-sm text-gray-500 dark:text-gray-400 overflow-y-auto w-full ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Student Name</th>
                            <th className="px-6 py-3">Current Balance</th>
                            <th className="px-6 py-3">Guardian's Email</th>
                            {(delete_student || award_student) && <th className="px-6 py-3">Award</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {students?.filter(d => `${d?.first_name} ${d?.last_name}`.toLowerCase().includes(search.toLowerCase()))
                            .sort((a, b) => {
                                const lastNameA = a.last_name.toUpperCase();
                                const lastNameB = b.last_name.toUpperCase();
                                if (lastNameA < lastNameB) return -1;
                                if (lastNameA > lastNameB) return 1;

                                const firstNameA = a.first_name.toUpperCase();
                                const firstNameB = b.first_name.toUpperCase();
                                return firstNameA.localeCompare(firstNameB);
                            })
                            .map((data, index) => (
                                <tr className=" odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={index}>
                                    <td className="px-6 py-3 flex flex-row">
                                        <a
                                            onClick={() => {
                                                if (award_student) {
                                                    form.resetFields()
                                                    form.setFieldsValue({ student: data._id })
                                                    setVisible(true)
                                                }
                                            }}>
                                            {data?.first_name} {data?.last_name}
                                        </a>

                                    </td>
                                    <td className="px-6 py-3">{data?.points}</td>
                                    <td className="px-6 py-3"><a>{data?.guardian_email}</a></td>
                                    {(delete_student || award_student) && (
                                        <td className="px-6 py-3">
                                            {award_student && (
                                                <FaHistory
                                                    size={20}
                                                    className="text-blue-500 inline-block mr-2 hover:scale-105 hover:shadow-lg transition-all duration-300"
                                                    role="button"
                                                    onClick={() => {
                                                        setStudent(data)
                                                    }} />
                                            )}
                                            {award_student && (
                                                <FiGift
                                                    size={22}
                                                    className="text-success inline-block mr-2 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
                                                    role="button"
                                                    onClick={() => {
                                                        form.resetFields()
                                                        form.setFieldsValue({
                                                            student: data._id
                                                        })
                                                        setVisible(true)
                                                    }} />
                                            )}
                                            {edit_student && (
                                                <FiEdit
                                                    size={22}
                                                    className="text-success inline-block mr-2"
                                                    role="button"
                                                    onClick={() => {
                                                        form2.resetFields()
                                                        form2.setFieldsValue(data)
                                                        setVisible2(true)
                                                    }} />
                                            )}
                                            {delete_student && (
                                                <FiTrash
                                                    size={22}
                                                    className="text-danger inline-block"
                                                    role="button"
                                                    onClick={() => {
                                                        return useActionConfirm(deleteStudent, { _id: data._id }, () => {
                                                            getStudents()
                                                        }, `Are you sure you want to delete ${data?.first_name || ''} ${data?.last_name || ''}? This action can not be undone`, 'Yes, Delete')
                                                    }} />
                                            )}

                                        </td>
                                    )}
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}

        </>
    )
}
Students.layout = TeacherLayout
export default Students