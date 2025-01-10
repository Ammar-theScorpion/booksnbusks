import AdminLayout from "../../../layouts/admin";
import { useRouter } from "next/router";
import { useAction, useFetch } from "../../../helpers/hooks";
import { fetchAdmins, fetchTeachers, getSchools, postAdmin } from "../../../helpers/backend_helper";
import Table from "../../../components/common/table";
import { FiArrowLeft } from "react-icons/fi";
import { useState } from "react";
import SearchInput from "../../../components/form/search";
import { Form, Modal } from "antd";
import ModalForm from "../../../components/common/modal_form";
import InputFile from "../../../components/form/file";
import FormInput, { HiddenFormItem } from "../../../components/form/FormInput";
import FormSelect from "../../../components/form/FormSelect";

const Users = () => {
    const router = useRouter()
    const [schools] = useFetch(getSchools)
    const [admins, getAdmins] = useFetch(fetchAdmins)
    const [form] = Form.useForm()
    const [visible, setVisible] = useState(false)

    const columns = [
        {
            label: "Name",
            dataIndex: 'name',
            formatter: (_, { first_name, last_name }) => `${first_name || ''} ${last_name || ''}`
        },
        {
            label: "Email",
            dataIndex: 'email',
            formatter: d => <a href={`mailto:${d}`}>{d}</a>
        },
        {
            label: "School",
            dataIndex: 'school',
            formatter: d => d?.name
        }
    ]
    const [search, setSearch] = useState('')
    const [teachers, getTeachers] = useFetch(fetchTeachers, {}, false)

    return (
        <>
            <div className="flex flex-1">
                <h4>
                    <FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()} /> Admins
                </h4>
                <div className="flex flex-1 gap-4 justify-end pr-2 pb-2" >
                    <SearchInput value={search} setValue={setSearch} />
                    <a className="btn btn-primary " onClick={() => {
                        form.resetFields()
                        setVisible(true)
                    }}>Add Admin</a>
                </div>
            </div>
            <Table
                getData={getAdmins}
                data={admins?.filter(d => `${d?.first_name} ${d?.last_name}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a?.last_name?.toLowerCase()?.localeCompare(b?.last_name?.toLowerCase()))}
                columns={columns}
                onDelete={postAdmin}

            />
            <Modal
                visible={visible}
                onCancel={() => setVisible(false)}
                title="Add Admin" footer={null}>
                <Form form={form} layout="vertical" onFinish={values => {
                    return useAction(postAdmin, { ...values, admin: true }, () => {
                        getAdmins()
                        setVisible(false)
                    })
                }}>

                    <FormSelect name="school" label="School" options={schools}
                        onSelect={school => getTeachers({ school })} required />
                    <FormSelect name="_id" label="Teacher" options={teachers?.map(d => ({
                        ...d,
                        name: `${d.first_name || ''} ${d?.last_name || ''}`
                    }))} required />
                    <button className="btn btn-primary mt-3">Submit</button>
                </Form>


            </Modal>
        </>
    )
}
Users.layout = AdminLayout
export default Users