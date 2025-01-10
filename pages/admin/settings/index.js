import AdminLayout from "../../../layouts/admin";
import { Form } from "antd";
import FormInput from "../../../components/form/FormInput";
import InputFile, { getUploadImageUrl } from "../../../components/form/file";
import { postSchoolUpdate } from "../../../helpers/backend_helper";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/router";
import { useUserContext } from "../../../contexts/user";
import { useEffect } from "react";
import { useAction } from "../../../helpers/hooks";
import { swalLoading } from "../../../components/common/alert";

const Settings = () => {
    const [form] = Form.useForm()
    const router = useRouter()
    const user = useUserContext()
    useEffect(() => {
        if (!!user) {
            form.setFieldsValue({
                ...user?.school,
                logo: user?.school?.logo?.length > 5 ? [{
                    uid: '-1',
                    name: 'xxx.png',
                    status: 'done',
                    url: user?.school?.logo
                }] : [],
            })
        }
    }, [user])

    return (
        <>
            {/* yacoob remove back */}
            {/* <h4 className="page-title"><FiArrowLeft className="mr-2 inline-block" role="button"
                                                    onClick={() => router.back()}/> School Settings</h4> */}
            <Form layout="vertical" form={form} onFinish={async values => {
                swalLoading()
                values.logo = await getUploadImageUrl(values.logo)
                return useAction(postSchoolUpdate, values, () => {
                    user?.getProfile()
                })
            }}>
                <FormInput name="name" label="School Name" required />
                <InputFile name="logo" label="School Logo" form={form} />
                <button className="btn btn-primary">Submit</button>
            </Form>
        </>
    )
}
Settings.layout = AdminLayout
export default Settings