import AdminLayout from "../../../layouts/admin";
import { useRouter } from "next/router";
import { useFetch } from "../../../helpers/hooks";
import { getSchools, postProductAdd, postProductUpdate, postSchool } from "../../../helpers/backend_helper";
import { FiArrowLeft } from "react-icons/fi";
import Table from "../../../components/common/table";
import { useState } from "react";
import { Form, Modal } from "antd";
import FormInput, { HiddenFormItem } from "../../../components/form/FormInput";
import InputFile, { getUploadImageUrl } from "../../../components/form/file";
import ModalForm from "../../../components/common/modal_form";
import Button from "../../../components/form/Button";

const Schools = () => {
    const router = useRouter()
    const [form] = Form.useForm()
    const [visible, setVisible] = useState(false)
    const [data, getData] = useFetch(getSchools)

    console.log(data)
    const columns = [
        {
            label: "Role Name",
            dataIndex: 'name',
        },
        {
            label: "Logo",
            dataIndex: 'logo',
            formatter: d => <img src={d} className="h-8" alt="" />
        }
    ]

    return (
        <>
            <ModalForm
                form={form}
                visible={visible}
                setVisible={setVisible}
                addFunc={async values => {
                    values.logo = await getUploadImageUrl(values.logo)
                    return postSchool(values)
                }}
                onFinish={() => {
                    getData()
                    setVisible(false)
                }}
                title="School">
                <HiddenFormItem name="_id" />
                <FormInput name="name" label="Name" required />
                <FormInput name="password" label="Password" required />
                <InputFile name="logo" label="Logo" form={form} />
            </ModalForm>
            <div className="flex justify-end">
                {/* remove back yacoob */}
                {/* <h4>
                    <FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()} /> School
                </h4> */}
                <div>
                    {/* enhance button yacoob */}
                    <Button className="btn btn-primary mb-2" onClick={() => {
                        form.resetFields()
                        setVisible(true)
                    }}>Add School</Button>
                </div>
            </div>
            <Table
                getData={getData}
                columns={columns}
                data={data}
                actionLabel="Edit"
                onEdit={(values) => {
                    form.resetFields()
                    form.setFieldsValue({
                        ...values,
                        logo: values.logo?.length > 5 ? [{
                            uid: '-1',
                            name: 'xxx.png',
                            status: 'done',
                            url: values.logo
                        }] : [],
                    })
                    setVisible(true)
                }}
            />
        </>
    )
}
Schools.layout = AdminLayout
export default Schools