import TeacherLayout from "../../../layouts/teacher";
import { Form, Typography } from "antd";
import FormInput from "../../../components/form/FormInput";
import InputFile, { getUploadImageUrl } from "../../../components/form/file";
import { postSchoolUpdate } from "../../../helpers/backend_helper";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/router";
import { useUserContext } from "../../../contexts/user";
import { useEffect, useState } from "react";
import { useAction } from "../../../helpers/hooks";
import { swalLoading } from "../../../components/common/alert";
import Button from "../../../components/form/Button";

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
            <div className=" mx-auto mt-10 w-full lg p-6 bg-white shadow-lg rounded-lg">
                <div className="flex items-center mb-4">
                    <FiArrowLeft
                        className="text-xl text-blue-600 cursor-pointer hover:text-blue-800 transition duration-300"
                        onClick={() => router.back()}
                    />
                    <Typography.Title level={4} className="ml-3 mb-0">
                        Update School Information
                    </Typography.Title>
                </div>
                <Form layout="vertical"  form={form} onFinish={async values => {
                    swalLoading()
                    values.logo = await getUploadImageUrl(values.logo)
                    return useAction(postSchoolUpdate, values, () => {
                        user?.getProfile()
                    })
                }}>
                    <FormInput name="name" label="School Name" required />
                    <InputFile name="logo" label="School Logo" form={form} />
                    <Button>Submit</Button>
                </Form>
            </div>

        </>
    )
}
Settings.layout = TeacherLayout
export default Settings